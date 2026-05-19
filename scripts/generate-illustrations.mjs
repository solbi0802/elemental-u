// Re-runnable image generation for the five element illustrations on the
// saju card. Calls Google's Gemini 2.5 Flash Image API and writes the
// returned PNG into public/illustrations/{element}.png.
//
// Usage:
//   npm run generate:cards              # all five elements
//   npm run generate:cards wood         # just one
//   npm run generate:cards wood fire    # subset
//
// Run again to regenerate (each call costs 1 image-gen request).

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public', 'illustrations');
mkdirSync(PUBLIC_DIR, { recursive: true });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY required. Set it in .env.local then run with:');
  console.error('  node --env-file=.env.local scripts/generate-illustrations.mjs');
  process.exit(1);
}

const MODEL = 'gemini-3.1-flash-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const PROMPTS = {
  wood: `Traditional Korean folk painting (민화 / Minhwa) of an elegant white crane with a red crown standing among gracefully bowing pine branches. Aged ivory hanji paper background with subtle natural fiber texture. Painted in traditional mineral pigments — deep indigo blue, vermilion red, ochre yellow, mineral green, soft gold accents. Flat decorative Joseon-era composition with bold ink linework. Vertical centered composition. No text, no characters. Museum-quality detail.`,
  fire: `Traditional Korean folk painting (민화 / Minhwa) of a smiling stylized tiger looking up at a black-and-white magpie perched on a pine branch — the famous 호작도 (Tiger and Magpie) motif. Aged ivory hanji paper background with subtle fiber texture. Tiger painted with bold orange-and-black stripes and large round friendly eyes, in traditional mineral pigments. Magpie in black and white. Pine needles in rich green. Flat decorative Joseon-era composition with bold ink linework. No text, no characters. Museum-quality detail.`,
  earth: `Traditional Korean folk painting (민화 / Minhwa) of a flourishing peony bloom with butterflies hovering above. Aged ivory hanji paper background with subtle fiber texture. Peony rendered in deep pink and crimson, leaves in mineral green, butterflies in gold and indigo with delicate detail. Flat decorative Joseon-era composition with bold ink linework. No text, no characters. Museum-quality detail.`,
  metal: `Traditional Korean folk painting (민화 / Minhwa) of an ornate phoenix (봉황) with long flowing tail feathers and outstretched wings, surrounded by stylized auspicious clouds (영지문). Aged ivory hanji paper background with subtle fiber texture. Phoenix painted in mineral red, indigo blue, gold, with intricate feather scales. Clouds in pale indigo and white. Flat decorative Joseon-era composition with bold ink linework. No text, no characters. Museum-quality detail.`,
  water: `Traditional Korean folk painting (민화 / Minhwa) of a carp leaping over rolling waves with lotus flowers blooming nearby — the classic 어해도 (Carp and Lotus) motif symbolizing perseverance. Aged ivory hanji paper background with subtle fiber texture. Carp painted with gold-and-ochre scales, waves in deep indigo with white foam, lotus in pink and pale rose. Flat decorative Joseon-era composition with bold ink linework. No text, no characters. Museum-quality detail.`,
};

const ALL_ELEMENTS = Object.keys(PROMPTS);

async function generateOne(element) {
  const prompt = PROMPTS[element];
  if (!prompt) throw new Error(`Unknown element: ${element}`);

  console.log(`→ generating ${element}…`);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errText.slice(0, 400)}`);
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(`No image in response. Got: ${JSON.stringify(json).slice(0, 400)}`);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  const outPath = resolve(PUBLIC_DIR, `${element}.png`);
  writeFileSync(outPath, buffer);
  console.log(`✓ ${element} → ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const argv = process.argv.slice(2);
  const targets = argv.length === 0 ? ALL_ELEMENTS : argv;

  for (const el of targets) {
    try {
      await generateOne(el);
    } catch (err) {
      console.error(`✗ ${el}: ${err.message}`);
    }
  }
}

main();
