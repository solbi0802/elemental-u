/* Loads the four fonts the SajuCard needs as ArrayBuffers so next/og's
   satori pipeline can embed them in the rendered PNG.

   The font files live in public/fonts and are fetched relative to the
   request URL so this works in both dev (localhost) and Vercel
   deployments without hardcoding origins. */

const FONT_PATHS = [
  'Cormorant-Medium.ttf',
  'Cormorant-MediumItalic.ttf',
  'NotoSerifKR-Bold.otf',
  'Inter-Regular.ttf',
] as const;

export interface CardFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 700;
  style: 'normal' | 'italic';
}

export async function loadCardFonts(request: Request): Promise<CardFont[]> {
  const origin = new URL(request.url).origin;
  const buffers = await Promise.all(
    FONT_PATHS.map((file) =>
      fetch(`${origin}/fonts/${file}`).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch font ${file}: ${res.status}`);
        return res.arrayBuffer();
      }),
    ),
  );
  const [cormorant, cormorantItalic, notoSerifKR, inter] = buffers;

  return [
    { name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' },
    { name: 'Cormorant', data: cormorantItalic, weight: 500, style: 'italic' },
    /* Noto Serif KR carries both Hangul and Hanja glyphs — same font
       handles all CJK characters on the card. */
    { name: 'NotoSerifKR', data: notoSerifKR, weight: 700, style: 'normal' },
    { name: 'Inter', data: inter, weight: 400, style: 'normal' },
  ];
}
