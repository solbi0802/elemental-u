import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/* Loads the four fonts used by next/og's satori pipeline (saju card +
   home-page OG image) as ArrayBuffers.

   Reads directly from public/fonts/ on disk instead of fetching over
   HTTP. That works in three contexts where the previous fetch approach
   didn't: build-time prerender of metadata files (no dev server
   running), edge-cold-start in Vercel, and local dev where the origin
   resolution would otherwise depend on env var setup. */

const FONT_FILES = [
  'Cormorant-Medium.woff',
  'Cormorant-MediumItalic.woff',
  'NotoSerifKR-Bold.otf',
  'Inter-Regular.woff',
] as const;

export interface CardFont {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 700;
  style: 'normal' | 'italic';
}

export async function loadCardFonts(): Promise<CardFont[]> {
  const fontsDir = resolve(process.cwd(), 'public', 'fonts');
  const buffers = await Promise.all(
    FONT_FILES.map((file) => readFile(resolve(fontsDir, file))),
  );
  const [cormorant, cormorantItalic, notoSerifKR, inter] = buffers;

  return [
    { name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' },
    { name: 'Cormorant', data: cormorantItalic, weight: 500, style: 'italic' },
    /* Noto Serif KR carries both Hangul and Hanja glyphs — same font
       handles all CJK characters in the renders. */
    { name: 'NotoSerifKR', data: notoSerifKR, weight: 700, style: 'normal' },
    { name: 'Inter', data: inter, weight: 400, style: 'normal' },
  ];
}
