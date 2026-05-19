'use client';

import * as s from './KoreanPatterns.css';

/*
  Elemental-U pattern motifs — gold (#e8b94a / #d4a857) on deep jade canvas.
  Two layers:
    1. <KoreanPatterns/>  — floating background, opacity 0.22–0.32 (visible but not blocking)
    2. <PatternStrip/>    — prominent horizontal band of 7 hanja seals, opacity 1.0
*/

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';

/* ── Stepped cloud (영지구름) ── background motif ── */
function SteppedCloud({ size = 200, color = GOLD_LINE, opacity = 0.55 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size * 0.35} viewBox="0 0 240 84" fill="none" opacity={opacity}>
      <path d="M20 62 H40 V52 H60 V42 H90 V32 H120 V22 H150 V32 H180 V42 H200 V52 H220 V62 H240"
        stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M30 72 H50 V62 H70 V52 H100 V42 H130 V32 H155 V42 H185 V52 H205 V62 H225 V72"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M45 80 H65 V72 H85 V62 H110 V52 H140 V52 H165 V62 H190 V72 H210 V80"
        stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ── Curly cloud (뭉게구름) ── background motif ── */
function CurlyCloud({ size = 120, color = GOLD_LINE, opacity = 0.5 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 160 100" fill="none" opacity={opacity}>
      <path d="M20 70 C20 70 10 50 30 40 C50 30 55 45 55 45 C55 45 50 25 75 20 C100 15 105 35 105 35 C105 35 110 20 130 25 C150 30 145 50 140 55 C135 60 150 65 140 75 C130 85 110 75 100 72 C90 69 80 78 65 75 C50 72 45 80 30 78 C15 76 20 70 20 70Z"
        stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M35 55 C35 50 42 42 52 45" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M80 38 C82 30 95 28 100 35" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M120 45 C125 38 138 40 135 50" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Mountain arcs (산문) ── background motif ── */
function MountainArcs({ size = 180, color = GOLD_LINE, opacity = 0.5 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 220 110" fill="none" opacity={opacity}>
      <path d="M10 100 A55 55 0 0 1 65 45" stroke={color} strokeWidth="2" fill="none" />
      <path d="M15 100 A50 50 0 0 1 62 52" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M20 100 A45 45 0 0 1 60 58" stroke={color} strokeWidth="1" fill="none" />
      <path d="M55 100 A55 55 0 0 1 110 10 A55 55 0 0 1 165 100" stroke={color} strokeWidth="2" fill="none" />
      <path d="M62 100 A48 48 0 0 1 110 20 A48 48 0 0 1 158 100" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M69 100 A41 41 0 0 1 110 30 A41 41 0 0 1 151 100" stroke={color} strokeWidth="1" fill="none" />
      <path d="M155 45 A55 55 0 0 1 210 100" stroke={color} strokeWidth="2" fill="none" />
      <path d="M158 52 A50 50 0 0 1 205 100" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M160 58 A45 45 0 0 1 200 100" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ── Round cloud (구름문) ── background motif ── */
function CloudMotif({ size = 120, color = GOLD_LINE, opacity = 0.45 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="none" opacity={opacity}>
      <path d="M100 110 C100 110 30 110 30 70 C30 30 70 20 100 20 C130 20 170 30 170 70 C170 110 100 110 100 110Z"
        stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M100 100 C100 100 45 100 45 68 C45 36 75 28 100 28 C125 28 155 36 155 68 C155 100 100 100 100 100Z"
        stroke={color} strokeWidth="1" fill="none" />
      <path d="M100 90 C100 90 58 90 58 66 C58 42 80 36 100 36 C120 36 142 42 142 66 C142 90 100 90 100 90Z"
        stroke={color} strokeWidth="0.8" fill="none" />
    </svg>
  );
}

/* ── Eight-petal flower lattice (꽃살문) ── background motif ── */
function FlowerLattice({ size = 100, color = GOLD_LINE, opacity = 0.45 }: {
  size?: number; color?: string; opacity?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" opacity={opacity}>
      <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + 22 * Math.cos(rad);
        const cy = 50 + 22 * Math.sin(rad);
        return <circle key={angle} cx={cx} cy={cy} r="18" stroke={color} strokeWidth="0.8" fill="none" />;
      })}
      <circle cx="50" cy="50" r="8" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ── Wave divider (해파문) ── horizontal band separator ── */
export function WaveDivider({ color = GOLD_LINE }: { color?: string }) {
  return (
    <svg className={s.waveDivider} viewBox="0 0 400 30" fill="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <path
          key={i}
          d={`M${i * 44 - 2} 28 A20 20 0 0 1 ${i * 44 + 20} 8 A20 20 0 0 1 ${i * 44 + 42} 28`}
          stroke={color}
          strokeWidth="1.6"
          fill="none"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Prominent seal motifs — used in <PatternStrip>
   ───────────────────────────────────────────── */

/* 壽 Longevity seal — circular */
function LongevitySeal() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={GOLD_LINE} strokeWidth="2" />
      <circle cx="50" cy="50" r="38" stroke={GOLD_LINE} strokeWidth="1" />
      <text x="50" y="64" textAnchor="middle" fontSize="38" fill={GOLD} fontWeight="900"
        style={{ fontFamily: 'var(--font-hanja), "Noto Serif KR", serif' }}>壽</text>
    </svg>
  );
}

/* 福 Fortune seal — square */
function FortuneSeal() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <rect x="6" y="6" width="88" height="88" stroke={GOLD_LINE} strokeWidth="2" />
      <rect x="14" y="14" width="72" height="72" stroke={GOLD_LINE} strokeWidth="1" />
      <text x="50" y="64" textAnchor="middle" fontSize="38" fill={GOLD} fontWeight="900"
        style={{ fontFamily: 'var(--font-hanja), "Noto Serif KR", serif' }}>福</text>
    </svg>
  );
}

/* 囍 Double-happiness seal — circular */
function DoubleHappinessSeal() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={GOLD_LINE} strokeWidth="2" />
      <circle cx="50" cy="50" r="38" stroke={GOLD_LINE} strokeWidth="1" />
      <text x="50" y="64" textAnchor="middle" fontSize="36" fill={GOLD} fontWeight="900"
        style={{ fontFamily: 'var(--font-hanja), "Noto Serif KR", serif' }}>囍</text>
    </svg>
  );
}

/* Octagonal flower — 8-sided frame with 8-petal flower */
function OctagonalFlower() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" stroke={GOLD_LINE} strokeWidth="2" />
      <polygon points="34,14 66,14 86,34 86,66 66,86 34,86 14,66 14,34" stroke={GOLD_LINE} strokeWidth="1" />
      <g stroke={GOLD} strokeWidth="1.6" fill="none">
        <circle cx="50" cy="50" r="6" />
        <ellipse cx="50" cy="32" rx="5" ry="11" />
        <ellipse cx="50" cy="68" rx="5" ry="11" />
        <ellipse cx="32" cy="50" rx="11" ry="5" />
        <ellipse cx="68" cy="50" rx="11" ry="5" />
        <ellipse cx="38" cy="38" rx="4" ry="10" transform="rotate(-45 38 38)" />
        <ellipse cx="62" cy="62" rx="4" ry="10" transform="rotate(-45 62 62)" />
        <ellipse cx="62" cy="38" rx="4" ry="10" transform="rotate(45 62 38)" />
        <ellipse cx="38" cy="62" rx="4" ry="10" transform="rotate(45 38 62)" />
      </g>
    </svg>
  );
}

/* Eight-petal flower — circular frame with 8-petal flower */
function EightPetalFlower() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={GOLD_LINE} strokeWidth="1.5" />
      <g stroke={GOLD} strokeWidth="1.5" fill="none">
        <circle cx="50" cy="50" r="7" />
        <ellipse cx="50" cy="22" rx="6" ry="14" />
        <ellipse cx="50" cy="78" rx="6" ry="14" />
        <ellipse cx="22" cy="50" rx="14" ry="6" />
        <ellipse cx="78" cy="50" rx="14" ry="6" />
        <ellipse cx="32" cy="32" rx="5" ry="12" transform="rotate(-45 32 32)" />
        <ellipse cx="68" cy="68" rx="5" ry="12" transform="rotate(-45 68 68)" />
        <ellipse cx="68" cy="32" rx="5" ry="12" transform="rotate(45 68 32)" />
        <ellipse cx="32" cy="68" rx="5" ry="12" transform="rotate(45 32 68)" />
      </g>
    </svg>
  );
}

/* Geometric octagon — 8-sided frame with cross + diamond */
function GeometricOctagon() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" stroke={GOLD_LINE} strokeWidth="2" />
      <g stroke={GOLD} strokeWidth="1.2">
        <line x1="50" y1="14" x2="50" y2="86" />
        <line x1="14" y1="50" x2="86" y2="50" />
        <line x1="22" y1="22" x2="78" y2="78" />
        <line x1="78" y1="22" x2="22" y2="78" />
        <polygon points="50,30 70,50 50,70 30,50" fill="none" />
      </g>
    </svg>
  );
}

/* Lotus circle — circular frame with stylized lotus */
function LotusCircle() {
  return (
    <svg viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" stroke={GOLD_LINE} strokeWidth="2" />
      <g stroke={GOLD} strokeWidth="1.4" fill="none">
        <path d="M50 30 Q42 38 50 50 Q58 38 50 30Z" />
        <path d="M50 70 Q42 62 50 50 Q58 62 50 70Z" />
        <path d="M30 50 Q38 42 50 50 Q38 58 30 50Z" />
        <path d="M70 50 Q62 42 50 50 Q62 58 70 50Z" />
        <path d="M36 36 Q42 38 50 50 Q42 42 36 36Z" />
        <path d="M64 64 Q58 62 50 50 Q58 58 64 64Z" />
        <path d="M64 36 Q58 38 50 50 Q58 42 64 36Z" />
        <path d="M36 64 Q42 62 50 50 Q42 58 36 64Z" />
        <circle cx="50" cy="50" r="6" />
      </g>
    </svg>
  );
}

/* Small seal — used as inline ornament inside cards (single hanja in double-ring circle) */
export function HanjaSeal({ char = '命', size = 44 }: { char?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <circle cx="30" cy="30" r="28" stroke={GOLD_LINE} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="23" stroke={GOLD_LINE} strokeWidth="0.8" />
      <text x="30" y="40" textAnchor="middle" fontSize="22" fill={GOLD} fontWeight="900"
        style={{ fontFamily: 'var(--font-hanja), "Noto Serif KR", serif' }}>{char}</text>
    </svg>
  );
}

/* ── Prominent decorative band — 7 seals across ── */
export function PatternStrip() {
  return (
    <div className={s.stripWrap} aria-hidden="true">
      <div className={s.stripRow}>
        <div className={s.stripCell}><LongevitySeal /></div>
        <div className={s.stripCell}><OctagonalFlower /></div>
        <div className={s.stripCell}><FortuneSeal /></div>
        <div className={s.stripCell}><EightPetalFlower /></div>
        <div className={s.stripCell}><DoubleHappinessSeal /></div>
        <div className={s.stripCell}><GeometricOctagon /></div>
        <div className={s.stripCell}><LotusCircle /></div>
      </div>
    </div>
  );
}

/* ── Floating background layer ── */
export function KoreanPatterns() {
  return (
    <div className={s.layer} aria-hidden="true">
      {/* Stepped clouds */}
      <div className={s.motif} style={{ top: '4%', left: '0%' }}>
        <SteppedCloud size={280} color={GOLD_LINE} opacity={0.32} />
      </div>
      <div className={s.motifReverse} style={{ top: '52%', right: '-2%' }}>
        <SteppedCloud size={240} color={GOLD_LINE} opacity={0.26} />
      </div>

      {/* Curly clouds */}
      <div className={s.motif} style={{ top: '20%', right: '3%', animationDelay: '4s' }}>
        <CurlyCloud size={170} color={GOLD} opacity={0.28} />
      </div>
      <div className={s.motifReverse} style={{ bottom: '22%', left: '2%', animationDelay: '7s' }}>
        <CurlyCloud size={140} color={GOLD_LINE} opacity={0.24} />
      </div>

      {/* Mountain arcs */}
      <div className={s.motifStatic} style={{ bottom: '2%', right: '3%' }}>
        <MountainArcs size={260} color={GOLD_LINE} opacity={0.28} />
      </div>
      <div className={s.motifStatic} style={{ top: '66%', left: '1%', animationDelay: '5s' }}>
        <MountainArcs size={200} color={GOLD_LINE} opacity={0.22} />
      </div>

      {/* Round cloud */}
      <div className={s.motif} style={{ top: '36%', left: '10%', animationDelay: '2s' }}>
        <CloudMotif size={160} color={GOLD} opacity={0.24} />
      </div>
      <div className={s.motifReverse} style={{ top: '10%', right: '18%', animationDelay: '9s' }}>
        <CloudMotif size={130} color={GOLD_LINE} opacity={0.22} />
      </div>

      {/* Flower lattice */}
      <div className={s.motif} style={{ top: '56%', left: '60%', animationDelay: '3s' }}>
        <FlowerLattice size={140} color={GOLD_LINE} opacity={0.24} />
      </div>
      <div className={s.motifReverse} style={{ top: '5%', left: '38%', animationDelay: '11s' }}>
        <FlowerLattice size={105} color={GOLD} opacity={0.2} />
      </div>
    </div>
  );
}
