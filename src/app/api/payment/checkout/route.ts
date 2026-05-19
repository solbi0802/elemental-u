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
import type { SajuResult } from '@/lib/saju/types';

interface CheckoutBody {
  name?: string;
  birthDate?: string;
  birthTime?: string | null;
}

/* Strict config checks — guard against placeholder values in .env.local that
   would otherwise be truthy and route us into the real LS / Supabase code
   paths only to fail with cryptic errors deep in the SDKs.

   - Lemon Squeezy keys are short alnum strings; require min length + numeric
     IDs for store/variant.
   - Supabase service_role is a JWT (always starts with 'eyJ') and the URL
     follows a fixed pattern. */
function hasLemonSqueezyConfig(): boolean {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY ?? '';
  const storeId = process.env.LEMONSQUEEZY_STORE_ID ?? '';
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID ?? '';
  return (
    apiKey.length >= 32 &&
    /^\d+$/.test(storeId) &&
    /^\d+$/.test(variantId)
  );
}

function hasSupabaseConfig(): boolean {
  const url = process.env.SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return (
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.startsWith('eyJ') &&
    key.length > 100
  );
}

async function generateReadingsForBypass(name: string, sajuResult: SajuResult) {
  try {
    const gemini = await generateReadings(name || 'Friend', sajuResult);
    return shapeReadings(gemini);
  } catch (err) {
    console.warn('Dev-bypass Gemini call failed:', (err as Error).message);
    return null;
  }
}

async function tryPersistBypass(input: {
  name: string | null;
  birthDate: string;
  birthTime: string | null;
  sajuResult: SajuResult;
  readings: ReturnType<typeof shapeReadings> | null;
}): Promise<string | null> {
  if (!hasSupabaseConfig()) return null;
  try {
    const purchase = await insertPendingPurchase({
      name: input.name,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      sajuResult: input.sajuResult,
    });
    const devOrderId = `dev-bypass-${purchase.id}`;
    if (input.readings) {
      await markPaidWithReadings({
        sessionToken: purchase.session_token,
        lsOrderId: devOrderId,
        paidAmount: 299,
        paidCurrency: 'USD',
        readings: input.readings,
      });
    } else {
      await markPaidWithoutReadings({
        sessionToken: purchase.session_token,
        lsOrderId: devOrderId,
        paidAmount: 299,
        paidCurrency: 'USD',
      });
    }
    return purchase.session_token;
  } catch (err) {
    console.warn('Dev-bypass Supabase write failed:', (err as Error).message);
    return null;
  }
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

  const [year, month, day] = birthDate.split('-').map(Number);
  const sajuResult = calculateSaju(year, month, day, birthTime ?? null);

  /* === Real Lemon Squeezy flow ===
     Only attempted when both LS *and* Supabase look properly configured.
     Any failure inside this block silently falls through to the dev bypass
     below — the user still gets readings, just without the LS hosted page. */
  if (hasLemonSqueezyConfig() && hasSupabaseConfig()) {
    try {
      const purchase = await insertPendingPurchase({
        name: name ?? null,
        birthDate,
        birthTime: birthTime ?? null,
        sajuResult,
      });
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
      const redirectUrl = `${siteUrl}/?session=${purchase.session_token}&paid=true`;
      const checkout = await createCheckout({
        sessionToken: purchase.session_token,
        redirectUrl,
      });
      return NextResponse.json({
        checkout_url: checkout.url,
        session_token: purchase.session_token,
      });
    } catch (err) {
      console.warn('Real LS flow failed, falling back to bypass:', (err as Error).message);
      /* fall through */
    }
  }

  /* === Dev bypass ===
     Generates readings synchronously and returns them in the same response
     so the client can flip straight into the Unlocked state. Used when the
     env vars aren't set, or when the real flow above threw. */
  const readings = await generateReadingsForBypass(name ?? '', sajuResult);
  const sessionToken = await tryPersistBypass({
    name: name ?? null,
    birthDate,
    birthTime: birthTime ?? null,
    sajuResult,
    readings,
  });

  return NextResponse.json({
    bypassed: true,
    result: sajuResult,
    readings,
    session_token: sessionToken,
  });
}
