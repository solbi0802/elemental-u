import { ImageResponse } from 'next/og';
import { findBySessionToken } from '@/lib/db/purchases';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import { loadCardFonts } from '@/lib/og/fonts';

/* next/og runs on Node runtime here because findBySessionToken uses the
   server-only Supabase client. The PNG generation itself is satori-based
   and works on both runtimes. */
export const runtime = 'nodejs';

interface Params {
  params: Promise<{ session_token: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const { session_token } = await params;

  const purchase = await findBySessionToken(session_token).catch(() => null);
  if (!purchase || purchase.status !== 'paid' || !purchase.saju_result) {
    return new Response('Not found', { status: 404 });
  }

  const archetypeText = buildArchetypeText(
    purchase.saju_result.dominantElement,
    purchase.saju_result.dayMaster,
  );

  let fonts;
  try {
    fonts = await loadCardFonts(request);
  } catch (err) {
    console.error('Card image font load failed:', err);
    return new Response('Font loading failed', { status: 500 });
  }

  return new ImageResponse(
    (
      <SajuCard
        name={purchase.name || 'Anonymous'}
        birthDate={purchase.birth_date}
        sajuResult={purchase.saju_result}
        archetypeText={archetypeText}
      />
    ),
    {
      width: 1080,
      height: 1080,
      fonts,
      /* Cache the PNG for 1 hour at the CDN. The card content is immutable
         per session_token, so this is safe and avoids re-running Gemini-
         shaped data through satori on every share/preview hit. */
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
