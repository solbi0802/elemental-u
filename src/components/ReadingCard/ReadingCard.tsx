'use client';

import { motion } from 'framer-motion';
import type { ReadingSection } from '@/lib/saju/types';
import { slideUp } from '@/styles/animations';
import { HanjaSeal } from '@/components/KoreanPatterns/KoreanPatterns';
import * as s from './ReadingCard.css';

interface Props {
  reading: ReadingSection;
  index: number;
}

/* Three jade variants — rotates across 6 readings as: A B C A B C */
const VARIANTS = [
  { className: s.variantA, sealChar: '壽' },  // canvasSoft + gold hairline
  { className: s.variantB, sealChar: '福' },  // canvasDeep + gold accent (featured)
  { className: s.variantC, sealChar: '囍' },  // canvasElevated + cream text
] as const;

const SUBTITLES: Record<string, string> = {
  'Life Fortune': 'EARLY · MID · LATE YEARS',
  '2026 Fortune': 'YEAR OF THE FIRE HORSE · 丙午',
  'Career Reading': 'PATH · STRENGTHS · TIMING',
  'Love Reading': 'PATTERNS · COMPATIBILITY',
  'Health Reading': 'TENDENCIES · WELLNESS',
  'Wealth Reading': 'FINANCE · OPPORTUNITY',
};

const TITLE_SEALS: Record<string, string> = {
  'Life Fortune': '命',
  '2026 Fortune': '運',
  'Career Reading': '業',
  'Love Reading': '緣',
  'Health Reading': '康',
  'Wealth Reading': '財',
};

export function ReadingCard({ reading, index }: Props) {
  const variant = VARIANTS[index % VARIANTS.length];
  const sealChar = TITLE_SEALS[reading.title] || variant.sealChar;

  return (
    <motion.article
      className={`${s.card} ${variant.className}`}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
    >
      <div className={s.seal}>
        <HanjaSeal char={sealChar} size={56} />
      </div>

      <div className={s.eyebrow}>{SUBTITLES[reading.title] || ''}</div>

      <div className={s.header}>
        <span className={s.icon}>{reading.icon}</span>
        <h3 className={s.title}>{reading.title}</h3>
      </div>

      <div className={s.body}>{reading.content}</div>

      <div className={s.insight}>
        <div className={s.insightLabel}>KEY INSIGHT</div>
        <div className={s.insightText}>{reading.keyInsight}</div>
      </div>
    </motion.article>
  );
}
