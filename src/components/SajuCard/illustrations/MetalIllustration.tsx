/* 봉황 (Phoenix / Bonghwang) — 金 Metal
   Symbolism: virtue, decisive authority, renewal through transformation.
   The phoenix in Korean iconography blends pheasant, dragon, and crane —
   long flowing tail feathers, crown of plumes, body emerging from clouds. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';
const GOLD_SOFT = '#b89a4a';

export function MetalIllustration({ size = 500 }: { size?: number }) {
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

      {/* Auspicious cloud bed below the phoenix */}
      <g stroke={GOLD_LINE} strokeWidth="1.6" fill={GOLD} fillOpacity="0.08">
        <path d="M70 410 Q100 380 140 395 Q170 370 210 390 Q250 365 290 388 Q335 365 375 390 Q415 378 430 410 Q360 425 250 422 Q140 425 70 410 Z" />
      </g>
      <g stroke={GOLD} strokeWidth="1" fill="none" opacity="0.5">
        <path d="M120 405 Q135 392 150 402" />
        <path d="M220 405 Q235 392 250 402" />
        <path d="M320 405 Q335 392 350 402" />
      </g>

      {/* Phoenix body — central oval, slightly tilted */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M195 305 Q175 250 215 215 Q260 195 300 220 Q335 250 320 305 Q295 335 250 335 Q210 332 195 305 Z"
          stroke={GOLD_LINE}
          strokeWidth="2.4"
          fill={GOLD}
          fillOpacity="0.14"
        />

        {/* Feather scales on body */}
        <g stroke={GOLD} strokeWidth="1" fill="none">
          <path d="M215 240 Q225 248 215 256" />
          <path d="M235 232 Q245 240 235 248" />
          <path d="M255 228 Q265 236 255 244" />
          <path d="M275 232 Q285 240 275 248" />
          <path d="M295 240 Q305 248 295 256" />
          <path d="M220 270 Q230 278 220 286" />
          <path d="M245 265 Q255 273 245 281" />
          <path d="M270 265 Q280 273 270 281" />
          <path d="M295 270 Q305 278 295 286" />
        </g>

        {/* Long neck arching up-left */}
        <path
          d="M210 225 Q175 180 165 130"
          stroke={GOLD_LINE}
          strokeWidth="2.2"
          fill={GOLD}
          fillOpacity="0.1"
        />
        {/* Neck feather edge */}
        <path d="M220 218 Q190 178 180 130" stroke={GOLD} strokeWidth="1.2" fill="none" />

        {/* Head — slightly curved, looking up-left */}
        <path
          d="M150 115 Q140 100 155 88 Q175 80 188 95 Q195 115 180 128 Q165 130 150 115 Z"
          stroke={GOLD_LINE}
          strokeWidth="2"
          fill={GOLD}
          fillOpacity="0.2"
        />

        {/* Crown of plumes — three feathers radiating from head */}
        <path d="M170 85 Q165 60 175 45" stroke={GOLD_LINE} strokeWidth="1.6" fill="none" />
        <path d="M165 88 Q150 65 152 45" stroke={GOLD_LINE} strokeWidth="1.6" fill="none" />
        <path d="M158 92 Q138 75 130 55" stroke={GOLD_LINE} strokeWidth="1.6" fill="none" />
        {/* tips of plumes — small ovals */}
        <ellipse cx="175" cy="45" rx="3" ry="6" stroke={GOLD} strokeWidth="1.2" fill={GOLD} fillOpacity="0.3" />
        <ellipse cx="152" cy="45" rx="3" ry="6" stroke={GOLD} strokeWidth="1.2" fill={GOLD} fillOpacity="0.3" />
        <ellipse cx="130" cy="55" rx="3" ry="6" stroke={GOLD} strokeWidth="1.2" fill={GOLD} fillOpacity="0.3" />

        {/* Beak — pointed up-left */}
        <path d="M148 110 L130 105 L138 118 Z" stroke={GOLD_LINE} strokeWidth="1.4" fill={GOLD} fillOpacity="0.3" />

        {/* Eye */}
        <circle cx="173" cy="108" r="1.8" fill={GOLD_LINE} />
        <circle cx="173" cy="108" r="4" stroke={GOLD_LINE} strokeWidth="1" fill="none" />

        {/* Wings — two large feathered wings sweeping outward */}
        {/* Left wing */}
        <path
          d="M195 280 Q150 270 110 240 Q90 220 100 200 Q120 215 145 220 Q170 230 195 250 Z"
          stroke={GOLD_LINE}
          strokeWidth="2"
          fill={GOLD}
          fillOpacity="0.12"
        />
        {/* feather lines on left wing */}
        <g stroke={GOLD} strokeWidth="1.2" fill="none">
          <path d="M125 213 Q150 225 175 245" />
          <path d="M115 230 Q145 240 175 258" />
          <path d="M110 245 Q140 250 170 268" />
        </g>

        {/* Right wing */}
        <path
          d="M320 280 Q365 270 405 240 Q425 220 415 200 Q395 215 370 220 Q345 230 320 250 Z"
          stroke={GOLD_LINE}
          strokeWidth="2"
          fill={GOLD}
          fillOpacity="0.12"
        />
        {/* feather lines on right wing */}
        <g stroke={GOLD} strokeWidth="1.2" fill="none">
          <path d="M390 213 Q365 225 340 245" />
          <path d="M400 230 Q370 240 340 258" />
          <path d="M405 245 Q375 250 345 268" />
        </g>

        {/* Long flowing tail feathers — 3 streamers curving down */}
        <g stroke={GOLD_LINE} strokeWidth="1.8" fill="none" strokeLinecap="round">
          <path d="M240 335 Q220 380 195 410 Q180 425 165 420" />
          <path d="M255 335 Q255 385 245 415 Q240 430 230 430" />
          <path d="M275 335 Q295 380 320 410 Q335 425 350 420" />
        </g>

        {/* Tail feather "eyes" — peacock-like ornaments at tips */}
        <g>
          <ellipse cx="170" cy="415" rx="9" ry="14" stroke={GOLD_LINE} strokeWidth="1.5" fill={GOLD} fillOpacity="0.18" />
          <ellipse cx="170" cy="415" rx="4" ry="7" fill={GOLD} />
          <ellipse cx="237" cy="425" rx="9" ry="14" stroke={GOLD_LINE} strokeWidth="1.5" fill={GOLD} fillOpacity="0.18" />
          <ellipse cx="237" cy="425" rx="4" ry="7" fill={GOLD} />
          <ellipse cx="345" cy="415" rx="9" ry="14" stroke={GOLD_LINE} strokeWidth="1.5" fill={GOLD} fillOpacity="0.18" />
          <ellipse cx="345" cy="415" rx="4" ry="7" fill={GOLD} />
        </g>

        {/* Inner shorter tail wisps */}
        <path d="M245 335 Q240 370 245 400" stroke={GOLD_SOFT} strokeWidth="1" fill="none" />
        <path d="M265 335 Q270 370 265 400" stroke={GOLD_SOFT} strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}
