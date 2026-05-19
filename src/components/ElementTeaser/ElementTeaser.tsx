'use client';

import { motion } from 'framer-motion';
import type { Element } from '@/lib/saju/types';
import { fadeUp, staggerContainer } from '@/styles/animations';
import {
  buildArchetypeHeadline,
  buildArchetypeText,
} from '@/components/SajuCard/buildArchetypeText';
import * as s from './ElementTeaser.css';

interface Props {
  dominantElement: Element;
  dayMaster: Element;
}

function scrollToPaywall() {
  document.getElementById('paywall-cta')?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

export function ElementTeaser({ dominantElement, dayMaster }: Props) {
  const { prefix, archetype } = buildArchetypeHeadline(dominantElement);
  const body = buildArchetypeText(dominantElement, dayMaster);

  return (
    <motion.section
      className={s.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      aria-labelledby="teaser-heading"
    >
      <motion.header className={s.header} variants={fadeUp}>
        <p className={s.eyebrow}>Your Path · 命</p>

        <h2 id="teaser-heading" className={s.headline}>
          {prefix}{' '}
          <em className={s.archetype}>{archetype}</em>
        </h2>

        <p className={s.body}>{body}</p>
      </motion.header>

      <motion.hr className={s.divider} variants={fadeUp} aria-hidden="true" />

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
