/* Earth (土) medallion — mountain-peak band around a central hanja. */

import { HANJA_FONT_STACK } from '@/styles/fonts';

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

/* Small triple-peak mountain placed on the ring at a given angle. */
function MountainGroup({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const cx = 250 + Math.cos(rad) * 215;
  const cy = 250 + Math.sin(rad) * 215;
  return (
    <g transform={`rotate(${angle + 90} ${cx} ${cy})`}>
      <path
        d={`M ${cx - 18} ${cy + 12} L ${cx - 10} ${cy - 6} L ${cx - 2} ${cy + 12} Z`}
        fill={GOLD}
        opacity="0.55"
      />
      <path
        d={`M ${cx - 8} ${cy + 12} L ${cx} ${cy - 14} L ${cx + 8} ${cy + 12} Z`}
        fill={GOLD}
        opacity="0.85"
      />
      <path
        d={`M ${cx + 2} ${cy + 12} L ${cx + 10} ${cy - 6} L ${cx + 18} ${cy + 12} Z`}
        fill={GOLD}
        opacity="0.55"
      />
    </g>
  );
}

export function EarthIllustration({ size = 500 }: { size?: number }) {
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
      <circle cx="250" cy="250" r="195" fill="none" stroke={GOLD_LINE} strokeWidth="1" opacity="0.55" />
      <circle cx="250" cy="250" r="170" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.3" />

      {/* 8 mountain groups at intercardinal + cardinal positions */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <MountainGroup key={a} angle={a} />
      ))}

      {/* Cardinal accents */}
      <circle cx="250" cy="40" r="3" fill={GOLD} />
      <circle cx="460" cy="250" r="3" fill={GOLD} />
      <circle cx="250" cy="460" r="3" fill={GOLD} />
      <circle cx="40" cy="250" r="3" fill={GOLD} />

      {/* Central hanja — 土 */}
      <text
        x="250"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="230"
        fontWeight="700"
        fill={GOLD}
        style={{ fontFamily: HANJA_FONT_STACK }}
      >
        土
      </text>
    </svg>
  );
}
