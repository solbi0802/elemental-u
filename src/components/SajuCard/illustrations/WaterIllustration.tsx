/* 어해도 (Carp + Lotus) — 水 Water
   Symbolism: wisdom, perseverance, ascending transformation (carp leaping
   the gate becomes a dragon), purity emerging from murky depth (lotus).
   Classic 민화 subject linking persistence to spiritual elevation. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';
const GOLD_SOFT = '#b89a4a';

export function WaterIllustration({ size = 500 }: { size?: number }) {
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

      {/* Wave layer 1 — bottom */}
      <g stroke={GOLD_LINE} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M50 410 Q90 395 130 410 Q170 425 210 410 Q250 395 290 410 Q330 425 370 410 Q410 395 450 410" />
        <path d="M50 425 Q90 415 130 425 Q170 435 210 425 Q250 415 290 425 Q330 435 370 425 Q410 415 450 425" strokeWidth="1.2" opacity="0.7" />
      </g>

      {/* Wave layer 2 — mid */}
      <g stroke={GOLD_LINE} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M40 365 Q85 350 130 365 Q175 380 220 365 Q265 350 310 365 Q355 380 400 365 Q435 355 460 365" />
      </g>

      {/* Smaller wave crests / spray */}
      <g stroke={GOLD} strokeWidth="1" fill="none" opacity="0.55">
        <path d="M120 390 Q125 380 135 390" />
        <path d="M210 390 Q215 380 225 390" />
        <path d="M310 390 Q315 380 325 390" />
      </g>

      {/* Lotus stem rising from water */}
      <g stroke={GOLD_LINE} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M180 380 Q175 320 165 270" />
        <path d="M320 380 Q330 330 340 280" />
      </g>

      {/* Lotus pad floating right side */}
      <g stroke={GOLD_LINE} strokeWidth="1.6" fill={GOLD} fillOpacity="0.08">
        <ellipse cx="350" cy="390" rx="38" ry="8" />
      </g>
      <path d="M315 388 Q330 380 350 380 Q368 382 385 388" stroke={GOLD} strokeWidth="1" fill="none" opacity="0.7" />

      {/* Left lotus — closed bud */}
      <g transform="translate(165 245)">
        <path
          d="M0 25 Q-15 -5 0 -25 Q15 -5 0 25 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.8"
          fill={GOLD}
          fillOpacity="0.12"
        />
        <path d="M-8 10 Q-12 -5 -3 -20" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M8 10 Q12 -5 3 -20" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M0 25 L0 -25" stroke={GOLD_LINE} strokeWidth="1" opacity="0.5" />
      </g>

      {/* Right lotus — open bloom */}
      <g transform="translate(340 250)">
        {/* outer petals — five spreading */}
        {[0, 60, -60, 120, -120].map((angle) => (
          <ellipse
            key={angle}
            cx={Math.sin((angle * Math.PI) / 180) * 18}
            cy={-Math.cos((angle * Math.PI) / 180) * 22}
            rx="9"
            ry="22"
            transform={`rotate(${angle} ${Math.sin((angle * Math.PI) / 180) * 18} ${-Math.cos((angle * Math.PI) / 180) * 22})`}
            stroke={GOLD_LINE}
            strokeWidth="1.6"
            fill={GOLD}
            fillOpacity="0.12"
          />
        ))}
        {/* inner petals — tighter */}
        {[30, -30, 90, -90, 0].map((angle, i) => (
          <ellipse
            key={`inner-${i}`}
            cx={Math.sin((angle * Math.PI) / 180) * 10}
            cy={-Math.cos((angle * Math.PI) / 180) * 12}
            rx="6"
            ry="14"
            transform={`rotate(${angle} ${Math.sin((angle * Math.PI) / 180) * 10} ${-Math.cos((angle * Math.PI) / 180) * 12})`}
            stroke={GOLD}
            strokeWidth="1.2"
            fill="none"
          />
        ))}
        {/* seed pod center */}
        <circle cx="0" cy="-5" r="7" stroke={GOLD_LINE} strokeWidth="1.4" fill={GOLD} fillOpacity="0.3" />
        <circle cx="-2" cy="-7" r="1" fill={GOLD_LINE} />
        <circle cx="2" cy="-3" r="1" fill={GOLD_LINE} />
        <circle cx="2" cy="-7" r="1" fill={GOLD_LINE} />
      </g>

      {/* Carp — leaping diagonally up-left, central focus */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* body — curved upward */}
        <path
          d="M170 360 Q140 300 175 240 Q215 200 270 195 Q310 200 320 230 Q325 260 295 290 Q255 320 220 340 Q195 355 170 360 Z"
          stroke={GOLD_LINE}
          strokeWidth="2.4"
          fill={GOLD}
          fillOpacity="0.13"
        />

        {/* Body scales — fish-scale arcs */}
        <g stroke={GOLD} strokeWidth="1.1" fill="none">
          <path d="M195 240 Q205 250 195 260" />
          <path d="M215 235 Q225 245 215 255" />
          <path d="M235 232 Q245 242 235 252" />
          <path d="M255 232 Q265 242 255 252" />
          <path d="M275 235 Q285 245 275 255" />
          <path d="M190 270 Q200 280 190 290" />
          <path d="M212 270 Q222 280 212 290" />
          <path d="M234 270 Q244 280 234 290" />
          <path d="M256 270 Q266 280 256 290" />
          <path d="M195 300 Q205 310 195 320" />
          <path d="M220 300 Q230 310 220 320" />
          <path d="M245 300 Q255 310 245 320" />
        </g>

        {/* Head — at upper left */}
        <path
          d="M270 195 Q260 175 280 165 Q310 158 325 175 Q335 195 322 215"
          stroke={GOLD_LINE}
          strokeWidth="2.2"
          fill={GOLD}
          fillOpacity="0.18"
        />

        {/* Eye */}
        <circle cx="298" cy="183" r="4" stroke={GOLD_LINE} strokeWidth="1.4" fill={GOLD} fillOpacity="0.4" />
        <circle cx="298" cy="183" r="1.8" fill={GOLD_LINE} />

        {/* Gill arc */}
        <path d="M280 200 Q288 215 280 230" stroke={GOLD_LINE} strokeWidth="1.4" fill="none" />

        {/* Whiskers (barbels) */}
        <path d="M285 215 Q275 225 268 235" stroke={GOLD_LINE} strokeWidth="1.2" fill="none" />
        <path d="M295 218 Q295 232 290 240" stroke={GOLD_LINE} strokeWidth="1.2" fill="none" />

        {/* Mouth — small open */}
        <path d="M325 190 Q335 185 340 192" stroke={GOLD_LINE} strokeWidth="1.4" fill="none" />

        {/* Top fin (dorsal) */}
        <path
          d="M255 198 Q260 165 280 155 Q275 175 285 195"
          stroke={GOLD_LINE}
          strokeWidth="1.8"
          fill={GOLD}
          fillOpacity="0.1"
        />
        {/* dorsal fin rays */}
        <path d="M265 195 L268 175" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M272 195 L274 165" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M278 195 L280 175" stroke={GOLD} strokeWidth="1" fill="none" />

        {/* Lower fin */}
        <path
          d="M210 310 Q200 340 215 360 Q220 340 230 320"
          stroke={GOLD_LINE}
          strokeWidth="1.8"
          fill={GOLD}
          fillOpacity="0.1"
        />

        {/* Tail — fanned at bottom-right */}
        <path
          d="M170 360 Q130 380 110 410 Q140 405 165 395"
          stroke={GOLD_LINE}
          strokeWidth="2"
          fill={GOLD}
          fillOpacity="0.15"
        />
        <path
          d="M170 360 Q145 390 130 420 Q155 410 170 395"
          stroke={GOLD_LINE}
          strokeWidth="1.6"
          fill={GOLD}
          fillOpacity="0.1"
        />
        {/* tail rays */}
        <path d="M150 380 L130 405" stroke={GOLD} strokeWidth="1" fill="none" />
        <path d="M158 388 L145 415" stroke={GOLD} strokeWidth="1" fill="none" />
      </g>

      {/* Water splash where carp emerges */}
      <g stroke={GOLD} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M155 365 Q150 355 145 358" />
        <path d="M180 372 Q175 362 178 358" />
        <circle cx="140" cy="350" r="2" fill={GOLD_SOFT} />
        <circle cx="160" cy="345" r="1.5" fill={GOLD_SOFT} />
      </g>

      {/* A few drifting cloud wisps upper area (signature 민화) */}
      <g stroke={GOLD_SOFT} strokeWidth="1.2" fill="none" opacity="0.55">
        <path d="M75 110 Q90 100 110 110 Q120 105 125 120 Q130 132 115 135 Q100 138 85 130 Q73 125 75 110 Z" />
      </g>
    </svg>
  );
}
