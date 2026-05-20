/* Wood (木) medallion — pine-needle decorations around a central hanja.
   Replaces the earlier folk-art crane attempt; the medallion composition
   is symmetric and pattern-based so it reads as a ceremonial Korean seal
   instead of a clumsy line drawing of an animal. */

import { HANJA_FONT_STACK } from '@/styles/fonts';

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

/* Single pine-needle fan — 5 thin strokes radiating from one anchor point.
   Rotated around the ring at evenly-spaced angles. */
function PineFan({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const cx = 250 + Math.cos(rad) * 215;
  const cy = 250 + Math.sin(rad) * 215;
  return (
    <g transform={`rotate(${angle + 90} ${cx} ${cy})`}>
      <line x1={cx} y1={cy} x2={cx} y2={cy + 26} stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx - 9} y2={cy + 24} stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + 9} y2={cy + 24} stroke={GOLD} strokeWidth="1.1" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx - 17} y2={cy + 19} stroke={GOLD} strokeWidth="0.9" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx + 17} y2={cy + 19} stroke={GOLD} strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

export function WoodIllustration({ size = 500 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer concentric rings — seal frame */}
      <circle cx="250" cy="250" r="240" fill="none" stroke={GOLD_LINE} strokeWidth="2" />
      <circle cx="250" cy="250" r="222" fill="none" stroke={GOLD_LINE} strokeWidth="1" opacity="0.55" />
      <circle cx="250" cy="250" r="180" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.3" />

      {/* Pine-needle fans rotated around the ring */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
        <PineFan key={a} angle={a} />
      ))}

      {/* Cardinal accents — small gold dots at the four directions */}
      <circle cx="250" cy="40" r="3" fill={GOLD} />
      <circle cx="460" cy="250" r="3" fill={GOLD} />
      <circle cx="250" cy="460" r="3" fill={GOLD} />
      <circle cx="40" cy="250" r="3" fill={GOLD} />

      {/* Central hanja — calligraphic 木 */}
      <text
        x="250"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="240"
        fontWeight="700"
        fill={GOLD}
        style={{ fontFamily: HANJA_FONT_STACK }}
      >
        木
      </text>
    </svg>
  );
}
