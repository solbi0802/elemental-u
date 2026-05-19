'use client';

import { motion } from 'framer-motion';
import type { Element } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import { fadeUp, staggerContainer } from '@/styles/animations';
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
  const dom = ELEMENT_META[dominantElement];
  const day = ELEMENT_META[dayMaster];
  const traits = dom.traits.slice(0, 3).map((t) => t.toLowerCase()).join(', ');

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
          You walk the path of{' '}
          <em className={s.archetype}>{dom.archetype}</em>
        </h2>

        <p className={s.body}>
          Born of {dom.label} and grounded in {day.label}, you channel{' '}
          {traits} energy. Your {day.label} day master shapes how this{' '}
          {dom.label.toLowerCase()} moves through the world.
        </p>
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
