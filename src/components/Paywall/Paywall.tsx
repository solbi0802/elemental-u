'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import type { SajuReadings } from '@/lib/saju/types';
import { ReadingCard } from '@/components/ReadingCard/ReadingCard';
import { SajuLoader } from '@/components/SajuLoader/SajuLoader';
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
  const {
    isPaid,
    isLoadingReadings,
    isProcessingPayment,
    sessionToken,
    name,
    birthDate,
    birthTime,
    startCheckout,
    retryReadings,
  } = useSajuStore();

  /* Build the per-user destiny-card URL.
     - With Supabase: /card/[session_token] — the route loads the row
       server-side and OG meta resolves to the right image.
     - Without Supabase (dev bypass): pass the raw inputs as query params
       so the preview page can recalculate saju client-side. Inputs are
       short (~50 chars total) which keeps the share URL clean — far
       better than base64-encoding the whole sajuResult blob. */
  let cardHref: string;
  if (sessionToken) {
    cardHref = `/card/${sessionToken}`;
  } else if (birthDate) {
    const params = new URLSearchParams();
    if (name) params.set('n', name);
    params.set('d', birthDate);
    if (birthTime) params.set('t', birthTime);
    cardHref = `/card/preview?${params.toString()}`;
  } else {
    cardHref = '/card/preview';
  }

  /* === Unlocked: payment completed AND readings arrived === */
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

        <motion.div className={s.cardEntryRow} variants={fadeUp}>
          <Link
            href={cardHref}
            className={s.cardEntryLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View your destiny card →
          </Link>
        </motion.div>

        {list.map((r, i) => (
          <ReadingCard key={r.title} reading={r} index={i} />
        ))}
      </motion.section>
    );
  }

  /* === Paid but Gemini failed (or returned null) === */
  if (isPaid && !isLoadingReadings && !readings) {
    return (
      <motion.section
        className={s.lockedSection}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        aria-labelledby="unavailable-heading"
      >
        <motion.header variants={fadeUp}>
          <p className={s.eyebrow}>Generation Failed</p>
          <h2 id="unavailable-heading" className={s.title}>
            Reading temporarily unavailable
          </h2>
        </motion.header>

        <motion.aside id="paywall-cta" className={s.ctaBlock} variants={fadeUp}>
          <p className={s.ctaDesc}>
            We couldn&apos;t reach the destiny service. Your purchase is safe —
            please try again in a moment.
          </p>
          <button
            type="button"
            className={s.ctaButton}
            onClick={() => void retryReadings()}
          >
            Try again
          </button>
        </motion.aside>
      </motion.section>
    );
  }

  /* === Paid + loading Gemini: swap locked grid for SajuLoader === */
  /* === Or pre-payment Locked state: show locked grid + CTA === */
  const showLoader = isPaid && isLoadingReadings;

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
        <p className={s.eyebrow}>
          {showLoader ? 'Composing Your Reading' : '6 Personalized Readings'}
        </p>
        <h2 id="locked-heading" className={s.title}>
          {showLoader ? 'Your destiny is being written' : 'Go deeper into your chart'}
        </h2>
      </motion.header>

      <AnimatePresence mode="wait" initial={false}>
        {showLoader ? (
          <motion.div
            key="loader"
            className={s.paywallLoaderSlot}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <SajuLoader />
          </motion.div>
        ) : (
          <motion.ul
            key="locked-grid"
            className={s.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            aria-label="Locked readings"
          >
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
        )}
      </AnimatePresence>

      {!showLoader && (
        <motion.aside id="paywall-cta" className={s.ctaBlock} variants={fadeUp}>
          <h3 className={s.ctaTitle}>Unlock your full reading</h3>
          <p className={s.ctaDesc}>
            Get all 6 personalized readings powered by AI and centuries of Korean wisdom.
          </p>
          <button
            type="button"
            className={s.ctaButton}
            onClick={() => void startCheckout()}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment
              ? 'Processing payment…'
              : 'Get complete destiny — $2.99'}
          </button>
          <small className={s.ctaFootnote}>One-time payment · Instant access</small>
        </motion.aside>
      )}
    </motion.section>
  );
}
