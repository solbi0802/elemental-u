'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import { trackEvent } from '@/lib/analytics';
import type { SajuReadings } from '@/lib/saju/types';
import { ReadingCard } from '@/components/ReadingCard/ReadingCard';
import { SajuLoader } from '@/components/SajuLoader/SajuLoader';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './Paywall.css';

interface Props {
  readings: SajuReadings | null;
}

export function Paywall({ readings }: Props) {
  const { isLoadingReadings, error, generateReadings } = useSajuStore();

  if (readings) {
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
        aria-labelledby="reading-heading"
      >
        <motion.header variants={fadeUp}>
          <p className={s.unlockedEyebrow}>Your Complete Reading</p>
          <h2 id="reading-heading" className={s.unlockedTitle}>
            Six perspectives on your chart
          </h2>
        </motion.header>

        <motion.div className={s.cardEntryRow} variants={fadeUp}>
          <Link
            href="/card/preview"
            className={s.cardEntryLink}
            onClick={() => trackEvent('destiny_card_opened')}
          >
            View and share your destiny card
          </Link>
        </motion.div>

        {list.map((reading, index) => (
          <ReadingCard key={reading.title} reading={reading} index={index} />
        ))}

        <motion.p className={s.disclaimer} variants={fadeUp}>
          This AI-generated reading is for entertainment and self-reflection.
          It is not medical, financial, legal, or professional advice.
        </motion.p>
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
      aria-labelledby="free-reading-heading"
    >
      <motion.header variants={fadeUp}>
        <p className={s.eyebrow}>
          {isLoadingReadings ? 'Composing Your Reading' : 'Free AI Reading'}
        </p>
        <h2 id="free-reading-heading" className={s.title}>
          {isLoadingReadings
            ? 'Your reading is being prepared'
            : 'Explore six sides of your chart'}
        </h2>
      </motion.header>

      <AnimatePresence mode="wait" initial={false}>
        {isLoadingReadings ? (
          <motion.div
            key="loader"
            className={s.paywallLoaderSlot}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <SajuLoader />
          </motion.div>
        ) : (
          <motion.aside
            key="cta"
            id="paywall-cta"
            className={s.ctaBlock}
            variants={fadeUp}
          >
            <h3 className={s.ctaTitle}>Generate your full reading</h3>
            <p className={s.ctaDesc}>
              Receive life, yearly, career, love, wellness, and money-pattern
              reflections grounded in your elemental chart.
            </p>
            {error && <p className={s.errorMessage}>{error}</p>}
            <button
              type="button"
              className={s.ctaButton}
              onClick={() => void generateReadings()}
            >
              {error ? 'Try again' : 'Generate free reading'}
            </button>
            <small className={s.ctaFootnote}>
              Free during beta. Usually ready in under a minute.
            </small>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
