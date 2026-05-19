import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { generateReadings } from '@/lib/gemini/client';
import { shapeReadings } from '@/lib/gemini/shapeReadings';
import {
  insertPendingPurchase,
  markPaidWithReadings,
  markPaidWithoutReadings,
} from '@/lib/db/purchases';
import { createCheckout } from '@/lib/payment/lemonsqueezy';

interface CheckoutBody {
  name?: string;
  birthDate?: string;
  birthTime?: string | null;
}

function hasLemonSqueezyConfig(): boolean {
  return Boolean(
    process.env.LEMONSQUEEZY_API_KEY &&
      process.env.LEMONSQUEEZY_STORE_ID &&
      process.env.LEMONSQUEEZY_VARIANT_ID,
  );
}

function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function POST(request: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, birthDate, birthTime } = body;
  if (!birthDate) {
    return NextResponse.json({ error: 'birthDate is required' }, { status: 400 });
  }

  /* Recompute saju server-side. Calculation is deterministic and fast
     (~50ms) so there's no win to caching from the /chart call. */
  const [year, month, day] = birthDate.split('-').map(Number);
  const sajuResult = calculateSaju(year, month, day, birthTime ?? null);

  /* === Dev bypass ===
     When LEMONSQUEEZY_* env vars aren't set we treat this as a development
     environment that doesn't have the real payment gateway wired up yet.
     Generate the readings synchronously and return them in the same response
     so the client can flip straight into the Unlocked state without an
     external redirect. */
  if (!hasLemonSqueezyConfig()) {
    let readings = null;
    try {
      const gemini = await generateReadings(name || 'Friend', sajuResult);
      readings = shapeReadings(gemini);
    } catch (err) {
      console.warn('Dev-bypass Gemini call failed:', (err as Error).message);
    }

    /* If Supabase is configured, persist the bypass purchase too so the
       /card flow still has a row to render from. If Supabase isn't set up
       either, the in-memory readings are still returned and the unlocked
       view will work for the current session — but the /card page won't. */
    let sessionToken: string | null = null;
    if (hasSupabaseConfig()) {
      try {
        const purchase = await insertPendingPurchase({
          name: name ?? null,
          birthDate,
          birthTime: birthTime ?? null,
          sajuResult,
        });
        sessionToken = purchase.session_token;
        const devOrderId = `dev-bypass-${purchase.id}`;
        if (readings) {
          await markPaidWithReadings({
            sessionToken,
            lsOrderId: devOrderId,
            paidAmount: 299,
            paidCurrency: 'USD',
            readings,
          });
        } else {
          await markPaidWithoutReadings({
            sessionToken,
            lsOrderId: devOrderId,
            paidAmount: 299,
            paidCurrency: 'USD',
          });
        }
      } catch (err) {
        console.warn('Dev-bypass Supabase write failed:', (err as Error).message);
        sessionToken = null;
      }
    }

    return NextResponse.json({
      bypassed: true,
      result: sajuResult,
      readings,
      session_token: sessionToken,
    });
  }

  /* === Real Lemon Squeezy flow === */
  let purchase;
  try {
    purchase = await insertPendingPurchase({
      name: name ?? null,
      birthDate,
      birthTime: birthTime ?? null,
      sajuResult,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Database error', detail: (err as Error).message },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const redirectUrl = `${siteUrl}/?session=${purchase.session_token}&paid=true`;

  let checkout;
  try {
    checkout = await createCheckout({
      sessionToken: purchase.session_token,
      redirectUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Payment provider error', detail: (err as Error).message },
      { status: 502 },
    );
  }

  return NextResponse.json({
    checkout_url: checkout.url,
    session_token: purchase.session_token,
  });
}
