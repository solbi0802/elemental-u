'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import { PreviewActions } from './PreviewActions';
import * as s from '../[session_token]/page.css';

/* Fallback card preview route — reads everything from the zustand store
   instead of Supabase. Used when the dev bypass path couldn't persist a
   purchase row (e.g. SUPABASE_SERVICE_ROLE_KEY missing or broken), so the
   user can still see and share their card without a database.

   Save/Share here use html-to-image to capture the rendered DOM client-side
   instead of going through /api/card/[token]/image — that endpoint needs
   a real session_token. Output quality is slightly different from the
   satori-rendered server PNG (DOM fonts vs. embedded fonts) but visually
   indistinguishable for the saju-card use case. */

export default function CardPreviewPage() {
  const router = useRouter();
  const { result, name, birthDate, isPaid } = useSajuStore();
  const cardScaleRef = useRef<HTMLDivElement>(null);

  /* Without a calculated saju there's nothing to render. Bounce to / so
     the user can fill the form first. */
  useEffect(() => {
    if (!result || !birthDate || !isPaid) {
      router.replace('/');
    }
  }, [result, birthDate, isPaid, router]);

  if (!result || !birthDate || !isPaid) return null;

  const archetypeText = buildArchetypeText(result.dominantElement, result.dayMaster);
  const displayName = name || 'Anonymous';

  return (
    <main className={s.page}>
      <header className={s.header}>
        <Link href="/" className={s.brandLink}>
          ← Elemental-U
        </Link>
      </header>

      <section className={s.cardSection}>
        <h1 className={s.subtitle}>Your destiny card</h1>
        <p className={s.eyebrow}>四柱命理 · Save or share</p>

        <div className={s.cardFrame}>
          <div className={s.cardScale} ref={cardScaleRef}>
            <SajuCard
              name={displayName}
              birthDate={birthDate}
              sajuResult={result}
              archetypeText={archetypeText}
            />
          </div>
        </div>

        <PreviewActions cardRef={cardScaleRef} cardName={displayName} />
      </section>
    </main>
  );
}
