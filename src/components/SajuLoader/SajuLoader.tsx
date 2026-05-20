'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HANJA_FONT_STACK } from '@/styles/fonts';
import * as s from './SajuLoader.css';

/* Pentagon Builder loader — the 五行 pentagon assembles itself while
   the user waits for Gemini to compose readings.

   Five element nodes (木 火 土 金 水) pop in one by one at the canonical
   ElementChart positions, then five connecting edges draw between them
   via stroke-dashoffset. The whole pentagon stays visible for the bulk
   of the loop, then fades and restarts. Status text cycles through four
   stages so the user perceives forward motion through the calculation. */

const NODE_POSITIONS = [
  { cx: 190, cy: 30,  delay: 0,    char: '火' }, // Fire — top
  { cx: 343, cy: 142, delay: 0.3,  char: '土' }, // Earth — right
  { cx: 284, cy: 320, delay: 0.6,  char: '金' }, // Metal — bottom right
  { cx: 96,  cy: 320, delay: 0.9,  char: '水' }, // Water — bottom left
  { cx: 37,  cy: 142, delay: 1.2,  char: '木' }, // Wood — left
] as const;

const EDGES = [
  { d: 'M 190 30 L 343 142', delay: 0.4 },
  { d: 'M 343 142 L 284 320', delay: 0.8 },
  { d: 'M 284 320 L 96 320', delay: 1.2 },
  { d: 'M 96 320 L 37 142', delay: 1.6 },
  { d: 'M 37 142 L 190 30', delay: 2.0 },
] as const;

const STEPS = [
  { eyebrow: 'Charting Five Elements', sub: '五 · 行' },
  { eyebrow: 'Reading the Four Pillars', sub: '四 · 柱' },
  { eyebrow: 'Translating Your Destiny', sub: '命 · 理' },
  { eyebrow: 'Composing Your Reading', sub: '述 · 命' },
] as const;

const STEP_MS = 2500;

export function SajuLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, STEP_MS);
    return () => clearInterval(interval);
  }, []);

  const step = STEPS[stepIndex];

  return (
    <div
      className={s.wrap}
      role="status"
      aria-live="polite"
      aria-label="Composing your saju reading"
    >
      <svg className={s.pentagon} viewBox="0 0 380 380" aria-hidden="true">
        {/* Outer guide ring — gentle opacity pulse so the loader never
            feels frozen even between the staggered node pops. */}
        <circle className={s.guideRing} cx="190" cy="190" r="170" />

        {/* Pentagon edges — each draws via stroke-dashoffset, staggered
            after the nodes so the geometry assembles in sequence. */}
        {EDGES.map((e) => (
          <path
            key={e.d}
            className={s.edge}
            d={e.d}
            style={{ animationDelay: `${e.delay}s` }}
          />
        ))}

        {/* Element nodes — scale-pop in, paired circle + hanja text. */}
        {NODE_POSITIONS.map((n) => (
          <g key={n.char}>
            <circle
              className={s.node}
              cx={n.cx}
              cy={n.cy}
              r="28"
              style={{ animationDelay: `${n.delay}s` }}
            />
            <text
              className={s.nodeText}
              x={n.cx}
              y={n.cy}
              style={{
                fontFamily: HANJA_FONT_STACK,
                animationDelay: `${n.delay}s`,
              }}
            >
              {n.char}
            </text>
          </g>
        ))}
      </svg>

      <div className={s.statusRow}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.eyebrow}
            className={s.statusInner}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className={s.statusEyebrow}>{step.eyebrow}</p>
            <p className={s.statusSub} style={{ fontFamily: HANJA_FONT_STACK }}>
              {step.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
