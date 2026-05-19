import { NextRequest, NextResponse } from 'next/server';
import { findBySessionToken } from '@/lib/db/purchases';

export const runtime = 'nodejs';

/* Client polls this every 2 s after returning from the LS checkout to find
   out whether the webhook has finished processing. Returns a minimal
   projection — only the fields the home page hydrates into the store. */

export async function GET(request: NextRequest) {
  const sessionToken = request.nextUrl.searchParams.get('session_token');
  if (!sessionToken) {
    return NextResponse.json({ error: 'session_token is required' }, { status: 400 });
  }

  let purchase;
  try {
    purchase = await findBySessionToken(sessionToken);
  } catch (err) {
    return NextResponse.json(
      { error: 'Database error', detail: (err as Error).message },
      { status: 500 },
    );
  }

  if (!purchase) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: purchase.status,
    name: purchase.name,
    saju_result: purchase.saju_result,
    readings: purchase.readings,
    /* ls_order_id presence tells the client "payment confirmed, webhook
       processing" even while status is still pending (Gemini in flight). */
    ls_order_id: purchase.ls_order_id,
  });
}
