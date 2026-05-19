import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { insertPendingPurchase } from '@/lib/db/purchases';
import { createCheckout } from '@/lib/payment/lemonsqueezy';

interface CheckoutBody {
  name?: string;
  birthDate?: string;
  birthTime?: string | null;
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

  /* Recompute saju server-side rather than trusting the client. Calculation
     is deterministic and fast (~50ms) so there's no win to caching from the
     /chart call. */
  const [year, month, day] = birthDate.split('-').map(Number);
  const sajuResult = calculateSaju(year, month, day, birthTime ?? null);

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
