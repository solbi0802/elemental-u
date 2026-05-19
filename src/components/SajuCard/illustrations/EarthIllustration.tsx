/* 모란도 (Peony + Butterfly) — 土 Earth
   Symbolism: wealth, honor, prosperity that endures. The peony is the
   "king of flowers" in East Asian iconography; the butterfly that hovers
   above signals transformation and lasting joy. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';
const GOLD_SOFT = '#b89a4a';

/* Helper — five-petal flower with concentric center.
   Used as the main peony bloom (large) and supporting buds (small). */
function PeonyBloom({
  cx,
  cy,
  size = 60,
  rotation = 0,
}: {
  cx: number;
  cy: number;
  size?: number;
  rotation?: number;
}) {
  const petals = [0, 72, 144, 216, 288].map((angle) => angle + rotation);
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* outer petal ring */}
      {petals.map((a) => {
        const rad = (a * Math.PI) / 180;
        const px = Math.cos(rad) * size * 0.55;
        const py = Math.sin(rad) * size * 0.55;
        return (
          <ellipse
            key={`outer-${a}`}
            cx={px}
            cy={py}
            rx={size * 0.42}
            ry={size * 0.26}
            transform={`rotate(${a} ${px} ${py})`}
            stroke={GOLD_LINE}
            strokeWidth="1.6"
            fill={GOLD}
            fillOpacity="0.08"
          />
        );
      })}
      {/* inner petal ring (rotated 36°) */}
      {petals.map((a) => {
        const offset = a + 36;
        const rad = (offset * Math.PI) / 180;
        const px = Math.cos(rad) * size * 0.32;
        const py = Math.sin(rad) * size * 0.32;
        return (
          <ellipse
            key={`inner-${a}`}
            cx={px}
            cy={py}
            rx={size * 0.3}
            ry={size * 0.18}
            transform={`rotate(${offset} ${px} ${py})`}
            stroke={GOLD}
            strokeWidth="1.2"
            fill="none"
          />
        );
      })}
      {/* stamens — small circle ring + center dot */}
      <circle cx="0" cy="0" r={size * 0.15} stroke={GOLD_LINE} strokeWidth="1" fill="none" />
      <circle cx="0" cy="0" r={size * 0.05} fill={GOLD} />
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
      {/* Sun ring */}
      <circle cx="250" cy="250" r="220" fill="none" stroke={GOLD_LINE} strokeWidth="2" opacity="0.45" />
      <circle cx="250" cy="250" r="208" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.32" />

      {/* Ornate base — stylized rock terrace (괴석) */}
      <g stroke={GOLD_LINE} strokeWidth="1.8" fill={GOLD} fillOpacity="0.05">
        <path d="M120 400 Q130 360 170 365 Q190 335 230 348 Q260 320 300 340 Q335 325 370 350 Q400 365 380 405 Q300 415 220 410 Q150 412 120 400 Z" />
        <path d="M155 395 Q175 372 200 380" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M260 385 Q290 360 320 378" stroke={GOLD} strokeWidth="1" fill="none" />
      </g>

      {/* Stems */}
      <g stroke={GOLD_LINE} strokeWidth="2" fill="none" strokeLinecap="round">
        {/* main stem to large bloom */}
        <path d="M240 395 Q230 320 250 230" />
        {/* side stem to right bud */}
        <path d="M260 395 Q295 350 330 280" />
        {/* side stem to left bud */}
        <path d="M225 395 Q195 350 165 290" />
      </g>

      {/* Leaves — paired serrated shapes */}
      <g stroke={GOLD_LINE} strokeWidth="1.6" fill={GOLD} fillOpacity="0.12">
        {/* left leaf cluster */}
        <path d="M205 340 Q175 330 165 305 Q190 305 215 325 Z" />
        <path d="M195 365 Q170 360 158 340 Q185 340 205 355 Z" />
        {/* right leaf cluster */}
        <path d="M275 335 Q305 325 320 305 Q300 300 270 320 Z" />
        <path d="M285 360 Q315 355 325 340 Q300 335 280 350 Z" />
        {/* mid leaf below bloom */}
        <path d="M238 290 Q215 285 205 270 Q230 270 245 280 Z" />
        <path d="M248 285 Q275 280 285 265 Q260 263 248 275 Z" />
      </g>

      {/* Leaf veins */}
      <g stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.65">
        <path d="M175 322 L200 332" />
        <path d="M175 348 L195 358" />
        <path d="M305 318 L285 328" />
        <path d="M310 348 L290 355" />
      </g>

      {/* Main peony bloom — center-top */}
      <PeonyBloom cx={250} cy={210} size={75} rotation={10} />

      {/* Right-side bud */}
      <PeonyBloom cx={330} cy={270} size={42} rotation={-20} />

      {/* Left-side bud */}
      <PeonyBloom cx={170} cy={285} size={36} rotation={45} />

      {/* Butterfly — upper area, wings outstretched */}
      <g transform="translate(370 145)">
        {/* upper wings */}
        <path
          d="M0 0 Q-25 -22 -50 -10 Q-58 5 -42 18 Q-20 22 -2 10 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.6"
          fill={GOLD}
          fillOpacity="0.18"
        />
        <path
          d="M0 0 Q25 -22 50 -10 Q58 5 42 18 Q20 22 2 10 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.6"
          fill={GOLD}
          fillOpacity="0.18"
        />
        {/* lower wings */}
        <path
          d="M0 5 Q-15 22 -28 32 Q-32 22 -20 12 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.4"
          fill={GOLD}
          fillOpacity="0.12"
        />
        <path
          d="M0 5 Q15 22 28 32 Q32 22 20 12 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.4"
          fill={GOLD}
          fillOpacity="0.12"
        />
        {/* body */}
        <ellipse cx="0" cy="5" rx="3" ry="14" fill={GOLD} stroke={GOLD_LINE} strokeWidth="1" />
        {/* antennae */}
        <path d="M-2 -8 Q-8 -16 -10 -22" stroke={GOLD_LINE} strokeWidth="1.2" fill="none" />
        <path d="M2 -8 Q8 -16 10 -22" stroke={GOLD_LINE} strokeWidth="1.2" fill="none" />
        {/* wing dots */}
        <circle cx="-32" cy="-2" r="2" fill={GOLD} />
        <circle cx="32" cy="-2" r="2" fill={GOLD} />
      </g>

      {/* Smaller distant butterfly upper-left */}
      <g transform="translate(120 165) scale(0.55)" stroke={GOLD_SOFT} strokeWidth="1.4" fill="none" opacity="0.7">
        <path d="M0 0 Q-25 -22 -50 -10 Q-58 5 -42 18 Q-20 22 -2 10 Z" />
        <path d="M0 0 Q25 -22 50 -10 Q58 5 42 18 Q20 22 2 10 Z" />
        <path d="M0 5 Q-15 22 -28 32 Q-32 22 -20 12 Z" />
        <path d="M0 5 Q15 22 28 32 Q32 22 20 12 Z" />
        <ellipse cx="0" cy="5" rx="2" ry="12" />
      </g>
    </svg>
  );
}
