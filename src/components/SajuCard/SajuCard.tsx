import type { SajuResult, HeavenlyStem, EarthlyBranch, Element } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import { ElementIllustration } from './illustrations';

/* All styles are inline so this component renders identically in the
   browser preview and in next/og's satori pipeline. vanilla-extract tokens
   would not be picked up by satori. Hex values mirror the brand tokens in
   src/styles/theme.css.ts — keep them in sync if the palette changes. */

const COLORS = {
  canvas: '#0d3d36',
  canvasSoft: '#0a2a25',
  goldPrimary: '#e8b94a',
  goldLine: '#d4a857',
  goldSoft: '#b89a4a',
  goldMuted: '#8a7d5c',
  creamText: '#f5e6c8',
  creamSoft: '#c9b896',
};

/* Pillar characters are stored as Hangul in the calculation result, but
   the card reads as a more ceremonial artifact in classical Hanja. */
const STEM_HANJA: Record<HeavenlyStem, string> = {
  갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊',
  기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸',
};

const BRANCH_HANJA: Record<EarthlyBranch, string> = {
  자: '子', 축: '丑', 인: '寅', 묘: '卯', 진: '辰', 사: '巳',
  오: '午', 미: '未', 신: '申', 유: '酉', 술: '戌', 해: '亥',
};

const ELEMENT_HANJA: Record<Element, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatBirthDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

interface Props {
  name: string;
  birthDate: string;
  sajuResult: SajuResult;
  archetypeText: string;
}

const HANJA_FONT = 'NotoSerifKR, "Noto Serif KR", "Times New Roman", serif';
const SERIF_FONT = 'Cormorant, "Cormorant Garamond", Georgia, serif';
const SANS_FONT = 'Inter, system-ui, sans-serif';

export function SajuCard({ name, birthDate, sajuResult, archetypeText }: Props) {
  const { dominantElement, dayMaster, fourPillars } = sajuResult;
  const archetype = ELEMENT_META[dominantElement].archetype;
  const dayMasterHanja = ELEMENT_HANJA[dayMaster];

  const pillars: Array<{ label: string; stem: string; branch: string }> = [
    { label: 'Year',  stem: STEM_HANJA[fourPillars.year.stem],  branch: BRANCH_HANJA[fourPillars.year.branch] },
    { label: 'Month', stem: STEM_HANJA[fourPillars.month.stem], branch: BRANCH_HANJA[fourPillars.month.branch] },
    { label: 'Day',   stem: STEM_HANJA[fourPillars.day.stem],   branch: BRANCH_HANJA[fourPillars.day.branch] },
  ];
  if (fourPillars.hour) {
    pillars.push({
      label: 'Hour',
      stem: STEM_HANJA[fourPillars.hour.stem],
      branch: BRANCH_HANJA[fourPillars.hour.branch],
    });
  }

  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        background: COLORS.canvas,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '64px 80px',
        fontFamily: SANS_FONT,
        color: COLORS.creamText,
        position: 'relative',
      }}
    >
      {/* Corner-bracket ornaments — top-left and bottom-right.
          Real elements (satori doesn't support pseudo-elements). */}
      <div style={cornerStyle('tl')} />
      <div style={cornerStyle('br')} />

      {/* === Top: brand band === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          paddingBottom: 18,
          borderBottom: `1px solid ${COLORS.goldLine}33`,
          width: '100%',
          fontFamily: HANJA_FONT,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 6,
          color: COLORS.goldPrimary,
        }}
      >
        <span>❀</span>
        <span style={{ fontFamily: SERIF_FONT, letterSpacing: 4, fontWeight: 500 }}>
          ELEMENTAL-U
        </span>
        <span>·</span>
        <span>四柱命理</span>
        <span>❀</span>
      </div>

      {/* === Middle: folk-art illustration === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 500,
          height: 500,
        }}
      >
        <ElementIllustration element={dominantElement} size={500} />
      </div>

      {/* === Lower middle: name + date + archetype === */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Ornament divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            width: '100%',
            marginBottom: 24,
            color: COLORS.goldLine,
          }}
        >
          <div style={{ flex: 1, height: 1, background: COLORS.goldLine, opacity: 0.5 }} />
          <span style={{ fontSize: 18 }}>❀</span>
          <div style={{ flex: 1, height: 1, background: COLORS.goldLine, opacity: 0.5 }} />
        </div>

        {/* Name — large serif */}
        <div
          style={{
            display: 'flex',
            fontFamily: SERIF_FONT,
            fontSize: 64,
            fontWeight: 500,
            letterSpacing: -1,
            color: COLORS.creamText,
            lineHeight: 1,
            marginBottom: 12,
          }}
        >
          {name}
        </div>

        {/* Birth date — mono uppercase */}
        <div
          style={{
            display: 'flex',
            fontSize: 16,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: COLORS.creamSoft,
            marginBottom: 26,
          }}
        >
          Born {formatBirthDate(birthDate)}
        </div>

        {/* Archetype + day master hanja */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 26,
          }}
        >
          <span
            style={{
              fontFamily: SERIF_FONT,
              fontSize: 36,
              fontWeight: 500,
              fontStyle: 'italic',
              color: COLORS.goldPrimary,
              letterSpacing: 1,
            }}
          >
            The {archetype.replace(/^The\s+/, '')}
          </span>
          <span
            style={{
              fontFamily: HANJA_FONT,
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.goldPrimary,
            }}
          >
            · {dayMasterHanja}
          </span>
        </div>

        {/* Four pillars row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            marginBottom: 28,
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={p.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontFamily: HANJA_FONT,
                  fontSize: 32,
                  fontWeight: 700,
                  color: COLORS.creamText,
                  letterSpacing: 1,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {p.stem}{p.branch}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: COLORS.goldMuted,
                }}
              >
                {p.label}{i < pillars.length - 1 ? '' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Essence quote */}
        <div
          style={{
            display: 'flex',
            fontFamily: SERIF_FONT,
            fontSize: 22,
            fontStyle: 'italic',
            fontWeight: 500,
            color: COLORS.creamSoft,
            lineHeight: 1.5,
            textAlign: 'center',
            maxWidth: 760,
            padding: '0 12px',
          }}
        >
          &ldquo;{archetypeText}&rdquo;
        </div>
      </div>

      {/* === Footer === */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          paddingTop: 18,
          borderTop: `1px solid ${COLORS.goldLine}33`,
          width: '100%',
          fontSize: 14,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: COLORS.goldSoft,
        }}
      >
        <span style={{ fontFamily: SERIF_FONT, letterSpacing: 3 }}>
          elemental-u.com
        </span>
        <span style={{ color: COLORS.goldLine }}>·</span>
        <span style={{ fontFamily: HANJA_FONT, fontSize: 20, color: COLORS.goldPrimary }}>
          命
        </span>
      </div>
    </div>
  );
}

function cornerStyle(position: 'tl' | 'br') {
  const base: Record<string, string | number> = {
    position: 'absolute',
    display: 'flex',
    width: 36,
    height: 36,
    borderColor: COLORS.goldPrimary,
    borderStyle: 'solid',
  };
  if (position === 'tl') {
    base.top = 36;
    base.left = 36;
    base.borderWidth = '2px 0 0 2px';
  } else {
    base.bottom = 36;
    base.right = 36;
    base.borderWidth = '0 2px 2px 0';
  }
  return base;
}
