'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as s from './SajuLoader.css';

const STEPS = [
  { hanja: '觀', label: 'Consulting the heavens', sub: '觀 天' },
  { hanja: '讀', label: 'Reading the four pillars', sub: '讀 四 柱' },
  { hanja: '譯', label: 'Translating your destiny', sub: '譯 命' },
  { hanja: '述', label: 'Composing your reading', sub: '述 命' },
] as const;

const STEP_MS = 2200;

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
    <div className={s.wrap} role="status" aria-live="polite" aria-label="Generating your reading">
      <div className={s.sealWrap}>
        <svg className={s.ring} viewBox="0 0 140 140" aria-hidden="true">
          {/* Soft static halo */}
          <circle cx="70" cy="70" r="64" fill="none" stroke="#d4a857" strokeWidth="0.8" opacity="0.18" />

          {/* Outer ring — slow forward spin with a single bright arc */}
          <g className={s.ringOuter}>
            <circle cx="70" cy="70" r="62" fill="none" stroke="#d4a857" strokeWidth="1.2" opacity="0.3" />
            <circle
              cx="70" cy="70" r="62" fill="none" stroke="#e8b94a"
              strokeWidth="2" strokeLinecap="round"
              strokeDasharray="28 360"
              className={s.ringPulse}
            />
          </g>

          {/* Inner ring — reverse spin with dashed accent */}
          <g className={s.ringInner}>
            <circle
              cx="70" cy="70" r="52" fill="none" stroke="#d4a857"
              strokeWidth="0.8" strokeDasharray="3 6" opacity="0.55"
            />
          </g>

          {/* Cardinal-direction gold dots — fixed, frame the hanja */}
          <circle cx="70" cy="6" r="2.2" fill="#e8b94a" />
          <circle cx="134" cy="70" r="2.2" fill="#e8b94a" />
          <circle cx="70" cy="134" r="2.2" fill="#e8b94a" />
          <circle cx="6" cy="70" r="2.2" fill="#e8b94a" />
        </svg>

        <AnimatePresence mode="wait">
          <motion.span
            key={step.hanja}
            className={s.seal}
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ fontFamily: 'var(--font-hanja), "Noto Serif KR", serif' }}
          >
            {step.hanja}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className={s.label}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.label}
            className={s.labelInner}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <p className={s.labelText}>{step.label}</p>
            <p className={s.labelSub}>{step.sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
