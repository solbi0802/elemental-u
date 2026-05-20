/* Fire (火) medallion — sun rays radiating around a central hanja. */

import { HANJA_FONT_STACK } from '@/styles/fonts';

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

/* A pointed flame-ray that originates from a point on the ring and tapers
   inward. Drawn as a narrow triangle. */
function SunRay({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const tipX = 250 + Math.cos(rad) * 232;
  const tipY = 250 + Math.sin(rad) * 232;
  const baseX1 = 250 + Math.cos(rad - 0.025) * 200;
  const baseY1 = 250 + Math.sin(rad - 0.025) * 200;
  const baseX2 = 250 + Math.cos(rad + 0.025) * 200;
  const baseY2 = 250 + Math.sin(rad + 0.025) * 200;
  return (
    <path
      d={`M ${tipX} ${tipY} L ${baseX1} ${baseY1} L ${baseX2} ${baseY2} Z`}
      fill={GOLD}
      opacity="0.75"
    />
  );
}

export function FireIllustration({ size = 500 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="250" cy="250" r="240" fill="none" stroke={GOLD_LINE} strokeWidth="2" />
      <circle cx="250" cy="250" r="200" fill="none" stroke={GOLD_LINE} strokeWidth="1.2" />
      <circle cx="250" cy="250" r="160" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.4" />

      {/* 24 sun rays radiating outward — evenly spaced */}
      {Array.from({ length: 24 }, (_, i) => i * 15).map((a) => (
        <SunRay key={a} angle={a} />
      ))}

      {/* Cardinal accent dots */}
      <circle cx="250" cy="40" r="3" fill={GOLD} />
      <circle cx="460" cy="250" r="3" fill={GOLD} />
      <circle cx="250" cy="460" r="3" fill={GOLD} />
      <circle cx="40" cy="250" r="3" fill={GOLD} />

      {/* Central hanja — 火 */}
      <text
        x="250"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="220"
        fontWeight="700"
        fill={GOLD}
        style={{ fontFamily: HANJA_FONT_STACK }}
      >
        火
      </text>
    </svg>
  );
}
