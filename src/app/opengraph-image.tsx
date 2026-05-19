import { ImageResponse } from 'next/og';
import { loadCardFonts } from '@/lib/og/fonts';

/* Open Graph card for the home page. Next.js convention — placing
   opengraph-image.{tsx,jsx} at any route automatically advertises it
   via og:image / twitter:image meta tags. This file generates a
   1200×630 PNG with the Elemental-U brand mark so shared links on
   Twitter / Kakao / Discord / iMessage / Slack preview properly. */

export const runtime = 'nodejs';
export const alt = 'Elemental-U — Discover Your Destiny Through Korean Astrology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const HANJA_FONT = 'NotoSerifKR, "Noto Serif KR", serif';
const SERIF_FONT = 'Cormorant, "Cormorant Garamond", serif';

export default async function OpengraphImage() {
  const fonts = await loadCardFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0d3d36',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          color: '#f5e6c8',
          position: 'relative',
        }}
      >
        {/* Corner brackets — same ornament as the saju card */}
        <div
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            width: 44,
            height: 44,
            borderTop: '2px solid #e8b94a',
            borderLeft: '2px solid #e8b94a',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            width: 44,
            height: 44,
            borderBottom: '2px solid #e8b94a',
            borderRight: '2px solid #e8b94a',
            display: 'flex',
          }}
        />

        {/* Top eyebrow band */}
        <div
          style={{
            display: 'flex',
            fontFamily: HANJA_FONT,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 8,
            color: '#e8b94a',
            marginBottom: 24,
          }}
        >
          四 柱 命 理
        </div>

        {/* Hanja seal — large gold 命 inside double ring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 180,
            height: 180,
            borderRadius: 90,
            border: '2px solid #d4a857',
            position: 'relative',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              inset: 12,
              borderRadius: 78,
              border: '1px solid #d4a857',
              opacity: 0.55,
            }}
          />
          <div
            style={{
              display: 'flex',
              fontFamily: HANJA_FONT,
              fontSize: 100,
              fontWeight: 700,
              color: '#e8b94a',
              lineHeight: 1,
            }}
          >
            命
          </div>
        </div>

        {/* Brand title — Cormorant serif at hero size */}
        <div
          style={{
            display: 'flex',
            fontFamily: SERIF_FONT,
            fontSize: 100,
            fontWeight: 500,
            letterSpacing: -2,
            lineHeight: 1,
            color: '#f5e6c8',
            marginBottom: 28,
          }}
        >
          Elemental-U
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontFamily: SERIF_FONT,
            fontStyle: 'italic',
            fontSize: 32,
            fontWeight: 500,
            color: '#c9b896',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Discover your destiny through Korean astrology
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            display: 'flex',
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#8a7d5c',
          }}
        >
          elemental-u.com · Four Pillars of Destiny
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
