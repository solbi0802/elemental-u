'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { ReadingSection } from '@/lib/saju/types';
import { trackEvent } from '@/lib/analytics';
import { slideUp } from '@/styles/animations';
import { HanjaSeal } from '@/components/KoreanPatterns/KoreanPatterns';
import * as s from './ReadingCard.css';

interface Props {
  reading: ReadingSection;
  index: number;
}

const VARIANTS = [
  { className: s.variantA, sealChar: '命' },
  { className: s.variantB, sealChar: '運' },
  { className: s.variantC, sealChar: '道' },
] as const;

const SUBTITLES: Record<string, string> = {
  'Life Fortune': 'EARLY · MID · LATE YEARS',
  '2026 Fortune': 'YEAR OF THE FIRE HORSE',
  'Career Reading': 'PATH · STRENGTHS · TIMING',
  'Love Reading': 'PATTERNS · COMMUNICATION',
  'Wellness Reading': 'TENDENCIES · WELLBEING',
  'Money Patterns': 'HABITS · PLANNING',
};

const TITLE_SEALS: Record<string, string> = {
  'Life Fortune': '命',
  '2026 Fortune': '年',
  'Career Reading': '業',
  'Love Reading': '愛',
  'Wellness Reading': '健',
  'Money Patterns': '財',
};

export function ReadingCard({ reading, index }: Props) {
  const viewedRef = useRef(false);
  const variant = VARIANTS[index % VARIANTS.length];
  const sealChar = TITLE_SEALS[reading.title] || variant.sealChar;

  return (
    <motion.article
      className={`${s.card} ${variant.className}`}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      custom={index}
      onViewportEnter={() => {
        if (viewedRef.current) return;
        viewedRef.current = true;
        trackEvent('reading_viewed', {
          reading: reading.title,
          position: index + 1,
        });
      }}
    >
      <div className={s.seal} aria-hidden="true">
        <HanjaSeal char={sealChar} size={56} />
      </div>

      <header className={s.cardHeader}>
        <p className={s.eyebrow}>{SUBTITLES[reading.title] || ''}</p>
        <div className={s.titleRow}>
          <span className={s.icon} aria-hidden="true">{reading.icon}</span>
          <h3 className={s.title}>{reading.title}</h3>
        </div>
      </header>

      <p className={s.body}>{reading.content}</p>

      <footer className={s.insight}>
        <p className={s.insightLabel}>Key Insight</p>
        <p className={s.insightText}>{reading.keyInsight}</p>
      </footer>
    </motion.article>
  );
}
