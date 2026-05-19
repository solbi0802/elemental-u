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
      >
        <motion.p className={s.unlockedEyebrow} variants={fadeUp}>
          READINGS UNLOCKED
        </motion.p>
        <motion.h2 className={s.unlockedTitle} variants={fadeUp}>
          Your complete destiny
        </motion.h2>
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
    >
      <motion.p className={s.eyebrow} variants={fadeUp}>6 PERSONALIZED READINGS</motion.p>
      <motion.h2 className={s.title} variants={fadeUp}>Go deeper into your chart</motion.h2>

      <motion.div className={s.grid} variants={fadeUp}>
        {SCROLLS.map((item) => (
          <div key={item.name} className={s.lockedCard}>
            <span className={s.lockedIcon}>{item.icon}</span>
            <div className={s.lockedInfo}>
              <span className={s.lockedName}>{item.name}</span>
              <span className={s.lockedDesc}>{item.desc}</span>
            </div>
            <span className={s.lockBadge}>🔒</span>
          </div>
        ))}
      </motion.div>

      <motion.div id="paywall-cta" className={s.ctaBlock} variants={fadeUp}>
        <h3 className={s.ctaTitle}>Unlock your full reading</h3>
        <p className={s.ctaDesc}>
          Get all 6 personalized readings powered by AI and centuries of Korean wisdom.
        </p>
        <button className={s.ctaButton} onClick={unlockReadings}>
          Get complete destiny — $0.99
        </button>
        <p className={s.ctaFootnote}>One-time payment · Instant access</p>
      </motion.div>
    </motion.section>
  );
}
