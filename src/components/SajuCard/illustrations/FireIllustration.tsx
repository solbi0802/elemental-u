/* 호작도 (Tiger + Magpie) — 火 Fire
   Symbolism: warding off evil, courageous spirit, joyful tidings. The tiger
   crouches with stylized stripes; the magpie perches on a pine bough above
   and announces good news. Classic Korean folk-painting subject. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';
const GOLD_SOFT = '#b89a4a';

export function FireIllustration({ size = 500 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer sun ring */}
      <circle cx="250" cy="250" r="220" fill="none" stroke={GOLD_LINE} strokeWidth="2" opacity="0.45" />
      <circle cx="250" cy="250" r="208" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.32" />

      {/* Rocky ground */}
      <g stroke={GOLD_LINE} strokeWidth="1.4" fill="none" opacity="0.6">
        <path d="M70 400 Q110 380 150 395 Q190 405 230 395 Q280 380 320 395 Q370 410 430 398" />
        <path d="M90 415 Q150 405 210 415 Q280 425 350 415 Q400 410 430 418" strokeWidth="1" opacity="0.7" />
      </g>

      {/* Pine bough across the top — stylized */}
      <g stroke={GOLD_LINE} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 130 Q130 95 220 105 Q310 115 440 90" strokeWidth="2.4" />
        {/* small branch stubs */}
        <path d="M120 110 L115 95" strokeWidth="1.4" />
        <path d="M180 108 L185 92" strokeWidth="1.4" />
        <path d="M260 110 L258 94" strokeWidth="1.4" />
        <path d="M330 108 L335 92" strokeWidth="1.4" />
      </g>

      {/* Pine needle clusters along bough */}
      <g stroke={GOLD} strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M115 95 L108 85 M115 95 L115 82 M115 95 L122 85" />
        <path d="M185 92 L178 82 M185 92 L185 80 M185 92 L192 82" />
        <path d="M258 94 L251 84 M258 94 L258 82 M258 94 L265 84" />
        <path d="M335 92 L328 82 M335 92 L335 80 M335 92 L342 82" />
      </g>

      {/* Magpie on the bough at upper right — body silhouette */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* body — egg shape */}
        <path
          d="M350 90 Q335 75 350 60 Q372 50 388 62 Q400 78 388 92 Q372 100 350 90 Z"
          stroke={GOLD_LINE}
          strokeWidth="1.8"
          fill={GOLD}
          fillOpacity="0.15"
        />
        {/* head */}
        <circle cx="395" cy="58" r="8" stroke={GOLD_LINE} strokeWidth="1.5" fill={GOLD} fillOpacity="0.2" />
        {/* beak */}
        <path d="M403 56 L412 52" stroke={GOLD_LINE} strokeWidth="1.4" />
        {/* eye */}
        <circle cx="396" cy="56" r="1.2" fill={GOLD_LINE} />
        {/* long tail extending up-right */}
        <path d="M353 65 Q345 50 340 35 Q345 30 350 32 Q355 45 360 60" stroke={GOLD_LINE} strokeWidth="1.6" fill={GOLD} fillOpacity="0.1" />
        {/* wing detail */}
        <path d="M362 75 Q372 80 380 82" stroke={GOLD} strokeWidth="1" />
        <path d="M362 82 Q372 86 380 87" stroke={GOLD} strokeWidth="1" />
        {/* legs gripping bough */}
        <path d="M368 92 L368 102 M368 102 L362 108 M368 102 L374 108" stroke={GOLD_LINE} strokeWidth="1.3" />
      </g>

      {/* Tiger — crouched in lower-mid, stylized */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* body — elongated oval */}
        <path
          d="M120 340 Q105 290 145 250 Q200 220 280 235 Q340 250 360 290 Q368 330 340 360 Q280 380 200 375 Q140 370 120 340 Z"
          stroke={GOLD_LINE}
          strokeWidth="2.5"
          fill={GOLD}
          fillOpacity="0.1"
        />

        {/* Stripes — diagonal short strokes (signature 민화 tiger) */}
        <g stroke={GOLD} strokeWidth="2" strokeLinecap="round">
          <path d="M160 270 L175 290" />
          <path d="M195 260 L208 285" />
          <path d="M230 250 L240 278" />
          <path d="M265 252 L272 280" />
          <path d="M300 260 L305 285" />
          <path d="M325 280 L325 305" />
          <path d="M155 320 L172 335" />
          <path d="M195 330 L210 348" />
          <path d="M240 335 L252 355" />
          <path d="M285 335 L295 355" />
          <path d="M325 325 L335 345" />
        </g>

        {/* Tiger head — large rounded square front-left */}
        <path
          d="M100 240 Q85 215 110 195 Q145 178 180 195 Q200 215 195 245 Q188 270 150 275 Q110 270 100 240 Z"
          stroke={GOLD_LINE}
          strokeWidth="2.2"
          fill={GOLD}
          fillOpacity="0.18"
        />

        {/* Ears — two triangular peaks */}
        <path d="M115 195 L108 175 L128 180 Z" stroke={GOLD_LINE} strokeWidth="1.8" fill={GOLD} fillOpacity="0.2" />
        <path d="M170 188 L180 170 L188 195 Z" stroke={GOLD_LINE} strokeWidth="1.8" fill={GOLD} fillOpacity="0.2" />

        {/* Face features */}
        <g stroke={GOLD_LINE} strokeLinecap="round">
          {/* eyes — large round (民畵 tiger trademark) */}
          <circle cx="128" cy="225" r="7" strokeWidth="1.8" fill="none" />
          <circle cx="166" cy="225" r="7" strokeWidth="1.8" fill="none" />
          <circle cx="128" cy="225" r="2.5" fill={GOLD_LINE} />
          <circle cx="166" cy="225" r="2.5" fill={GOLD_LINE} />
          {/* nose */}
          <path d="M147 244 L142 252 L152 252 Z" strokeWidth="1.5" fill={GOLD_LINE} />
          {/* mouth — small smile */}
          <path d="M147 257 Q140 265 132 263" strokeWidth="1.4" fill="none" />
          <path d="M147 257 Q154 265 162 263" strokeWidth="1.4" fill="none" />
          {/* forehead stripe —王 character suggestion */}
          <path d="M147 195 L147 215" strokeWidth="2" />
          <path d="M138 200 L156 200" strokeWidth="1.6" />
          <path d="M138 210 L156 210" strokeWidth="1.6" />
        </g>

        {/* Whiskers */}
        <g stroke={GOLD_SOFT} strokeWidth="1" strokeLinecap="round">
          <path d="M115 253 L95 250" />
          <path d="M115 257 L95 258" />
          <path d="M180 253 L200 250" />
          <path d="M180 257 L200 258" />
        </g>

        {/* Tail — curling up to the right */}
        <path
          d="M355 320 Q380 295 395 320 Q405 345 395 365 Q380 380 365 370"
          stroke={GOLD_LINE}
          strokeWidth="2.2"
          fill="none"
        />
        {/* tail stripes */}
        <path d="M375 310 L385 305" stroke={GOLD} strokeWidth="1.6" />
        <path d="M392 335 L402 332" stroke={GOLD} strokeWidth="1.6" />
        <path d="M390 360 L398 358" stroke={GOLD} strokeWidth="1.6" />

        {/* Paws — four shorts */}
        <path d="M170 375 L170 390 M180 375 L180 388" stroke={GOLD_LINE} strokeWidth="1.6" />
        <path d="M250 380 L250 395 M260 380 L260 393" stroke={GOLD_LINE} strokeWidth="1.6" />
      </g>
    </svg>
  );
}
