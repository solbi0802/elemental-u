/* Water (水) medallion — wave-arc band around a central hanja, lotus at
   the bottom. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

const HANJA_FONT = 'var(--font-hanja), "Noto Serif KR", "Times New Roman", serif';

/* Stylized 8-petal lotus rendered as a glyph centered at (cx, cy). */
function Lotus({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {petals.map((a) => {
        const rad = (a * Math.PI) / 180;
        const px = cx + Math.cos(rad) * size * 0.55;
        const py = cy + Math.sin(rad) * size * 0.55;
        return (
          <ellipse
            key={a}
            cx={px}
            cy={py}
            rx={size * 0.35}
            ry={size * 0.18}
            transform={`rotate(${a + 90} ${px} ${py})`}
            stroke={GOLD}
            strokeWidth="1.2"
            fill={GOLD}
            fillOpacity="0.18"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={size * 0.18} stroke={GOLD_LINE} strokeWidth="1" fill={GOLD} fillOpacity="0.4" />
    </g>
  );
}

export function WaterIllustration({ size = 500 }: { size?: number }) {
  /* Wave band: scalloped arcs that wrap around the outer ring. */
  const waveSegments = 24;
  const waveRadius = 215;

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

      {/* Wave-arc band — each segment is a small scalloped curve sitting on
          the outer ring at evenly-spaced angles. */}
      {Array.from({ length: waveSegments }, (_, i) => {
        const angle = (i * 360) / waveSegments;
        const rad = (angle * Math.PI) / 180;
        const cx = 250 + Math.cos(rad) * waveRadius;
        const cy = 250 + Math.sin(rad) * waveRadius;
        return (
          <g key={i} transform={`rotate(${angle + 90} ${cx} ${cy})`}>
            <path
              d={`M ${cx - 14} ${cy + 6} Q ${cx - 7} ${cy - 8} ${cx} ${cy + 6} Q ${cx + 7} ${cy - 8} ${cx + 14} ${cy + 6}`}
              fill="none"
              stroke={GOLD}
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Cardinal accents */}
      <circle cx="250" cy="40" r="3" fill={GOLD} />
      <circle cx="460" cy="250" r="3" fill={GOLD} />
      <circle cx="250" cy="460" r="3" fill={GOLD} />
      <circle cx="40" cy="250" r="3" fill={GOLD} />

      {/* Central hanja — 水 */}
      <text
        x="250"
        y="230"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="200"
        fontWeight="700"
        fill={GOLD}
        style={{ fontFamily: HANJA_FONT }}
      >
        水
      </text>

      {/* Small lotus glyph below the hanja — water + lotus symbolism */}
      <Lotus cx={250} cy={395} size={28} />
    </svg>
  );
}
