import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import {
  verifyWebhookSignature,
  type LsWebhookPayload,
} from '@/lib/payment/lemonsqueezy';
import {
  findBySessionToken,
  markPaidWithReadings,
  markPaidWithoutReadings,
} from '@/lib/db/purchases';
import { generateReadings } from '@/lib/gemini/client';
import type { SajuReadings } from '@/lib/saju/types';

/* Lemon Squeezy webhook handler.

   Flow:
   1. Read the raw body once (Web standard streams — can only read it once,
      and verifyWebhookSignature needs the exact bytes LS signed).
   2. HMAC verify against X-Signature.
   3. Only act on order_created with status='paid'. Other events return 200
      so LS doesn't retry.
   4. Find the pending purchase row by session_token (custom_data).
   5. Hand off Gemini generation + DB update to `after()` so the webhook
      returns 200 immediately. This keeps us inside Vercel Hobby's 10 s
      function timeout — Gemini routinely takes 10-15 s for a 6-section
      reading and would otherwise time out.
*/

export const runtime = 'nodejs';

interface GeminiReadingPart {
  content: string;
  keyInsight: string;
}

function shapeReadings(gemini: {
  lifeFortune: GeminiReadingPart;
  yearFortune: GeminiReadingPart;
  career: GeminiReadingPart;
  love: GeminiReadingPart;
  health: GeminiReadingPart;
  wealth: GeminiReadingPart;
}): SajuReadings {
  return {
    lifeFortune: { title: 'Life Fortune', icon: '📜', ...gemini.lifeFortune },
    yearFortune: { title: '2026 Fortune', icon: '🐍', ...gemini.yearFortune },
    career: { title: 'Career Reading', icon: '💼', ...gemini.career },
    love: { title: 'Love Reading', icon: '💕', ...gemini.love },
    health: { title: 'Health Reading', icon: '🏥', ...gemini.health },
    wealth: { title: 'Wealth Reading', icon: '💰', ...gemini.wealth },
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: LsWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LsWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const sessionToken = payload.meta?.custom_data?.session_token;
  const orderStatus = payload.data?.attributes?.status;

  /* Acknowledge but ignore events we don't act on (refund_created,
     subscription_*, order_refunded etc). Returning 200 prevents LS retries. */
  if (eventName !== 'order_created' || orderStatus !== 'paid') {
    return NextResponse.json({ ignored: true, event: eventName });
  }

  if (!sessionToken) {
    return NextResponse.json({ error: 'Missing session_token' }, { status: 400 });
  }

  const purchase = await findBySessionToken(sessionToken);
  if (!purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
  }

  /* Idempotency: if we already processed this token (webhook retry,
     duplicate delivery), skip. */
  if (purchase.status === 'paid' && purchase.readings) {
    return NextResponse.json({ already_processed: true });
  }

  const lsOrderId = payload.data.id;
  const paidAmount = payload.data.attributes.total;
  const paidCurrency = payload.data.attributes.currency;

  /* Hand Gemini off to the after-response phase. LS sees a 200 within
     hundreds of ms; the heavy work continues afterward and the client
     polls /api/payment/verify until readings appear. */
  after(async () => {
    try {
      const gemini = await generateReadings(purchase.name || 'Friend', purchase.saju_result);
      const readings = shapeReadings(gemini);
      await markPaidWithReadings({
        sessionToken,
        lsOrderId,
        paidAmount,
        paidCurrency,
        readings,
      });
    } catch (err) {
      console.error('Gemini generation failed in webhook', err);
      await markPaidWithoutReadings({
        sessionToken,
        lsOrderId,
        paidAmount,
        paidCurrency,
      });
    }
  });

  return NextResponse.json({ accepted: true });
}
