'use client';

import type { Element } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import { HANJA_FONT_STACK } from '@/styles/fonts';

interface Props {
  element: Element;
  percentage: number;
  cx: number;
  cy: number;
  isDominant: boolean;
  isHovered: boolean;
  onHover: (element: Element | null) => void;
}

const HANJA: Record<Element, string> = {
  wood: '木', fire: '火', earth: '土', metal: '金', water: '水',
};

export function ElementNode({ element, percentage, cx, cy, isDominant, isHovered, onHover }: Props) {
  const meta = ELEMENT_META[element];
  const r = 36;
  const ringR = r + 8;
  const circ = 2 * Math.PI * ringR;
  const filled = (percentage / 100) * circ;

  return (
    <g
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(element)}
      onMouseLeave={() => onHover(null)}
    >
      {/* progress track */}
      <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="rgba(212, 168, 87, 0.18)" strokeWidth={3} />

      {/* progress fill */}
      <circle
        cx={cx} cy={cy} r={ringR}
        fill="none" stroke={meta.color} strokeWidth={3}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease-out' }}
      />

      {/* main circle */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={isHovered ? meta.color : '#0a2a25'}
        stroke={isHovered ? meta.color : '#d4a857'}
        strokeWidth={1.5}
        style={{ transition: 'fill 0.2s, stroke 0.2s' }}
      />

      {/* inner double-ring (seal style) */}
      <circle
        cx={cx} cy={cy} r={r - 5}
        fill="none" stroke={isHovered ? '#0d3d36' : 'rgba(212, 168, 87, 0.35)'}
        strokeWidth={0.8}
        style={{ transition: 'stroke 0.2s' }}
      />

      {/* hanja */}
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="central"
        fill={isHovered ? '#0d3d36' : '#e8b94a'}
        fontSize="24" fontWeight="900"
        style={{ transition: 'fill 0.2s', fontFamily: HANJA_FONT_STACK }}
      >
        {HANJA[element]}
      </text>

      {/* label */}
      <text x={cx} y={cy + ringR + 18} textAnchor="middle" fill="#f5e6c8" fontSize="11" fontWeight="600"
        style={{ letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        {meta.label}
      </text>

      {/* percentage */}
      <text x={cx} y={cy + ringR + 34} textAnchor="middle" fill={meta.color} fontSize="14" fontWeight="700">
        {percentage}%
      </text>

      {/* dominant badge */}
      {isDominant && (
        <>
          <rect x={cx - 32} y={cy - r - 20} width={64} height={18} rx={9}
            fill={meta.color} stroke="#0d3d36" strokeWidth="1.5" />
          <text x={cx} y={cy - r - 8.5} textAnchor="middle" fill="#0d3d36"
            fontSize="8" fontWeight="800" letterSpacing="1.5">
            DOMINANT
          </text>
        </>
      )}
    </g>
  );
}
