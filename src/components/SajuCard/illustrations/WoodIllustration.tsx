/* 학수송이 (Crane + Pine) — 木 Wood
   Symbolism: longevity, steady growth, upright virtue. The crane stretches
   its neck through stylized pine branches in the lower half. Satori-safe:
   inline SVG paths only, no filters or external refs. */

const GOLD = '#e8b94a';
const GOLD_LINE = '#d4a857';
const GOLD_SOFT = '#b89a4a';

export function WoodIllustration({ size = 500 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring frame — a soft sun behind the scene */}
      <circle cx="250" cy="250" r="220" fill="none" stroke={GOLD_LINE} strokeWidth="2" opacity="0.45" />
      <circle cx="250" cy="250" r="208" fill="none" stroke={GOLD_LINE} strokeWidth="0.8" opacity="0.32" />

      {/* Distant mountains (stylized triple arcs, like 일월오봉도) */}
      <g stroke={GOLD_LINE} strokeWidth="1.4" fill="none" opacity="0.55">
        <path d="M70 360 Q140 250 210 360" />
        <path d="M180 360 Q250 230 320 360" />
        <path d="M290 360 Q360 260 430 360" />
      </g>

      {/* Mid-ground horizon line */}
      <line x1="60" y1="360" x2="440" y2="360" stroke={GOLD_LINE} strokeWidth="1" opacity="0.5" />

      {/* Pine tree on the left — trunk + canopy clusters */}
      <g stroke={GOLD_LINE} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* trunk */}
        <path d="M110 380 Q115 320 108 250 Q105 200 115 160" strokeWidth="3.2" />
        {/* lower branch sweeping right */}
        <path d="M112 270 Q160 260 200 270" strokeWidth="2" />
        <path d="M112 230 Q150 222 180 230" strokeWidth="1.8" />
        {/* upper branches */}
        <path d="M114 195 Q90 185 70 200" strokeWidth="1.6" />
        <path d="M114 170 Q145 162 170 175" strokeWidth="1.6" />
      </g>

      {/* Pine needle clusters (stylized fan groups) */}
      <g stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinecap="round">
        {/* cluster top */}
        <path d="M105 150 L98 140 M105 150 L105 138 M105 150 L112 140 M105 150 L92 144 M105 150 L118 144" />
        {/* cluster left-mid */}
        <path d="M65 195 L55 188 M65 195 L60 184 M65 195 L68 182 M65 195 L78 188" />
        {/* cluster mid-right */}
        <path d="M175 170 L165 162 M175 170 L172 158 M175 170 L180 158 M175 170 L188 162" />
        {/* cluster low-right */}
        <path d="M205 268 L195 260 M205 268 L202 256 M205 268 L210 256 M205 268 L218 260" />
        {/* cluster mid */}
        <path d="M183 226 L175 218 M183 226 L182 214 M183 226 L190 214 M183 226 L198 218" />
      </g>

      {/* Pine cones — tiny double ovals */}
      <g stroke={GOLD_SOFT} strokeWidth="1" fill="none">
        <ellipse cx="118" cy="200" rx="3.5" ry="5" />
        <ellipse cx="160" cy="250" rx="3.5" ry="5" />
      </g>

      {/* Crane — standing on the right, body curving up and head turned back */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* legs */}
        <path d="M310 390 L310 320 L305 295" stroke={GOLD_LINE} strokeWidth="1.8" />
        <path d="M330 390 L330 322 L334 297" stroke={GOLD_LINE} strokeWidth="1.8" />
        {/* feet (3 short lines each) */}
        <path d="M306 390 L300 396 M310 390 L310 397 M314 390 L320 396" stroke={GOLD_LINE} strokeWidth="1.4" />
        <path d="M326 390 L320 396 M330 390 L330 397 M334 390 L340 396" stroke={GOLD_LINE} strokeWidth="1.4" />

        {/* body — egg-shaped silhouette */}
        <path
          d="M275 280 Q260 250 290 220 Q325 195 360 220 Q390 250 370 290 Q360 310 320 308 Q285 305 275 280 Z"
          stroke={GOLD_LINE}
          strokeWidth="2.2"
          fill={GOLD}
          fillOpacity="0.08"
        />

        {/* wing detail — three swooping feather lines on the back */}
        <path d="M310 240 Q345 235 375 250" stroke={GOLD} strokeWidth="1.4" />
        <path d="M315 252 Q350 248 380 262" stroke={GOLD} strokeWidth="1.2" />
        <path d="M320 264 Q355 262 380 276" stroke={GOLD} strokeWidth="1" />

        {/* long neck arching back over body, head pointing right-up */}
        <path
          d="M290 232 Q280 200 300 175 Q330 155 360 165"
          stroke={GOLD_LINE}
          strokeWidth="2"
          fill="none"
        />

        {/* head — small oval with beak */}
        <ellipse cx="368" cy="162" rx="10" ry="7" stroke={GOLD_LINE} strokeWidth="1.6" fill={GOLD} fillOpacity="0.12" />
        {/* beak */}
        <path d="M378 162 L398 158" stroke={GOLD_LINE} strokeWidth="1.6" />
        {/* eye */}
        <circle cx="370" cy="160" r="1.4" fill={GOLD_LINE} />
        {/* signature red crown spot — keep gold for palette consistency */}
        <circle cx="365" cy="155" r="3" fill={GOLD} />

        {/* tail feathers */}
        <path d="M285 285 Q255 295 245 320" stroke={GOLD_LINE} strokeWidth="1.6" />
        <path d="M290 295 Q258 308 252 325" stroke={GOLD} strokeWidth="1.2" />
        <path d="M295 302 Q268 318 262 332" stroke={GOLD} strokeWidth="1" />
      </g>

      {/* Tiny stylized clouds in upper-right (民畵 motif) */}
      <g stroke={GOLD_LINE} strokeWidth="1.2" fill="none" opacity="0.55">
        <path d="M380 95 Q395 80 415 90 Q428 85 432 100 Q438 112 425 115 Q410 120 395 113 Q382 110 380 95 Z" />
        <path d="M390 100 Q400 95 408 102" />
      </g>
    </svg>
  );
}
