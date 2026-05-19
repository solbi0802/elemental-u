/* Metal (金) medallion — stepped-cloud (영지운) curls at the cardinal
   positions, with a central hanja. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

const HANJA_FONT = 'var(--font-hanja), "Noto Serif KR", "Times New Roman", serif';

/* A small stepped-cloud curl. Drawn at the origin then transformed into
   position around the medallion. The curl reads as the Korean 영지운 cloud
   pattern, traditionally paired with phoenix imagery — metal's symbolic
   counterpart in 五行. */
function CloudCurl({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const cx = 250 + Math.cos(rad) * 210;
  const cy = 250 + Math.sin(rad) * 210;
  return (
    <g transform={`rotate(${angle + 90} ${cx} ${cy})`}>
      <path
        d={`M ${cx - 26} ${cy + 8} Q ${cx - 26} ${cy - 4} ${cx - 14} ${cy - 4} Q ${cx - 14} ${cy - 14} ${cx} ${cy - 14} Q ${cx + 14} ${cy - 14} ${cx + 14} ${cy - 4} Q ${cx + 26} ${cy - 4} ${cx + 26} ${cy + 8}`}
        fill="none"
        stroke={GOLD}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx={cx} cy={cy - 4} r="1.6" fill={GOLD} />
    </g>
  );
}

/* Decorative small geometric ornament — a four-pointed diamond. Sits at
   the intercardinal positions to fill the gaps between cloud curls. */
function Diamond({ angle }: { angle: number }) {
  const rad = (angle * Math.PI) / 180;
  const cx = 250 + Math.cos(rad) * 215;
  const cy = 250 + Math.sin(rad) * 215;
  return (
    <path
      d={`M ${cx} ${cy - 6} L ${cx + 6} ${cy} L ${cx} ${cy + 6} L ${cx - 6} ${cy} Z`}
      fill={GOLD}
      opacity="0.7"
    />
  );
}

export function MetalIllustration({ size = 500 }: { size?: number }) {
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

      {/* Cloud curls at cardinal positions */}
      {[0, 90, 180, 270].map((a) => (
        <CloudCurl key={a} angle={a} />
      ))}

      {/* Diamond ornaments at intercardinal positions */}
      {[45, 135, 225, 315].map((a) => (
        <Diamond key={a} angle={a} />
      ))}

      {/* Cardinal accents */}
      <circle cx="250" cy="40" r="3" fill={GOLD} />
      <circle cx="460" cy="250" r="3" fill={GOLD} />
      <circle cx="250" cy="460" r="3" fill={GOLD} />
      <circle cx="40" cy="250" r="3" fill={GOLD} />

      {/* Central hanja — 金 */}
      <text
        x="250"
        y="250"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="220"
        fontWeight="700"
        fill={GOLD}
        style={{ fontFamily: HANJA_FONT }}
      >
        金
      </text>
    </svg>
  );
}
