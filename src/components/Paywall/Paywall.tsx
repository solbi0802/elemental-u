'use client';

import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import type { SajuReadings } from '@/lib/saju/types';
import { ReadingCard } from '@/components/ReadingCard/ReadingCard';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './Paywall.css';

const SCROLLS = [
  { icon: '📜', name: 'Life Fortune', desc: 'Early, mid & late years' },
  { icon: '🐍', name: '2026 Fortune', desc: 'Year of the Fire Horse' },
  { icon: '💼', name: 'Career Reading', desc: 'Path & strengths' },
  { icon: '💕', name: 'Love Reading', desc: 'Patterns & timing' },
  { icon: '🏥', name: 'Health Reading', desc: 'Tendencies & wellness' },
  { icon: '💰', name: 'Wealth Reading', desc: 'Finance & opportunity' },
];

interface Props {
  readings: SajuReadings | null;
}

export function Paywall({ readings }: Props) {
  const { isPaid, unlockReadings } = useSajuStore();

  if (isPaid && readings) {
    const list = [
      readings.lifeFortune,
      readings.yearFortune,
      readings.career,
      readings.love,
      readings.health,
      readings.wealth,
    ];

    return (
      <motion.section
        className={s.unlockedSection}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        aria-labelledby="unlocked-heading"
      >
        <motion.header variants={fadeUp}>
          <p className={s.unlockedEyebrow}>Readings Unlocked</p>
          <h2 id="unlocked-heading" className={s.unlockedTitle}>
            Your complete destiny
          </h2>
        </motion.header>

        {list.map((r, i) => (
          <ReadingCard key={r.title} reading={r} index={i} />
        ))}
      </motion.section>
    );
  }

  return (
    <motion.section
      className={s.lockedSection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      aria-labelledby="locked-heading"
    >
      <motion.header variants={fadeUp}>
        <p className={s.eyebrow}>6 Personalized Readings</p>
        <h2 id="locked-heading" className={s.title}>
          Go deeper into your chart
        </h2>
      </motion.header>

      <motion.ul className={s.grid} variants={fadeUp} aria-label="Locked readings">
        {SCROLLS.map((item) => (
          <li key={item.name} className={s.lockedCard}>
            <span className={s.lockedIcon} aria-hidden="true">{item.icon}</span>
            <span className={s.lockedInfo}>
              <span className={s.lockedName}>{item.name}</span>
              <span className={s.lockedDesc}>{item.desc}</span>
            </span>
            <span className={s.lockBadge} aria-hidden="true">🔒</span>
          </li>
        ))}
      </motion.ul>

      <motion.aside id="paywall-cta" className={s.ctaBlock} variants={fadeUp}>
        <h3 className={s.ctaTitle}>Unlock your full reading</h3>
        <p className={s.ctaDesc}>
          Get all 6 personalized readings powered by AI and centuries of Korean wisdom.
        </p>
        <button type="button" className={s.ctaButton} onClick={unlockReadings}>
          Get complete destiny — $0.99
        </button>
        <small className={s.ctaFootnote}>One-time payment · Instant access</small>
      </motion.aside>
    </motion.section>
  );
}
