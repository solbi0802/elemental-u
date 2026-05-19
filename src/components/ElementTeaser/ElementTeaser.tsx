'use client';

import { motion } from 'framer-motion';
import type { Element, SajuReadings } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './ElementTeaser.css';

interface Props {
  dominantElement: Element;
  dayMaster: Element;
  readings: SajuReadings | null;
}

/* First 1-2 sentences (or up to 220 chars) to give the bottom-fade mask
   enough text height to read as "more is below". */
function extractTeaser(text: string, maxChars = 220): string {
  const trimmed = text.trim();
  const twoSentences = trimmed.match(/^[^.!?]+[.!?]\s+[^.!?]+[.!?]/);
  const oneSentence = trimmed.match(/^[^.!?]+[.!?]/);
  const candidate = (twoSentences?.[0] ?? oneSentence?.[0] ?? trimmed).trim();
  if (candidate.length <= maxChars) return candidate;
  return candidate.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

function scrollToPaywall() {
  document.getElementById('paywall-cta')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

export function ElementTeaser({ dominantElement, dayMaster, readings }: Props) {
  const dom = ELEMENT_META[dominantElement];
  const day = ELEMENT_META[dayMaster];
  const traits = dom.traits.slice(0, 3).map((t) => t.toLowerCase()).join(', ');
  const snippet = readings?.lifeFortune?.content
    ? extractTeaser(readings.lifeFortune.content)
    : null;

  return (
    <motion.section
      className={s.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.p className={s.eyebrow} variants={fadeUp}>
        Your Path · 命
      </motion.p>

      <motion.h2 className={s.headline} variants={fadeUp}>
        You walk the path of{' '}
        <em className={s.archetype}>{dom.archetype}</em>
      </motion.h2>

      <motion.p className={s.body} variants={fadeUp}>
        Born of {dom.label} and grounded in {day.label}, you channel{' '}
        {traits} energy. Your {day.label} day master shapes how this{' '}
        {dom.label.toLowerCase()} moves through the world.
      </motion.p>

      <motion.hr className={s.divider} variants={fadeUp} aria-hidden />

      {snippet && (
        <motion.blockquote className={s.snippet} variants={fadeUp}>
          <span className={s.snippetMark} aria-hidden>“</span>
          <p className={s.snippetText}>{snippet}</p>
        </motion.blockquote>
      )}

      <motion.button
        type="button"
        className={s.cta}
        onClick={scrollToPaywall}
        variants={fadeUp}
      >
        Continue reading ↓
      </motion.button>
    </motion.section>
  );
}
