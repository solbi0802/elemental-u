'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import * as s from '../[session_token]/page.css';

/* Fallback card preview route — reads everything from the zustand store
   instead of Supabase. Used when the dev bypass path couldn't persist a
   purchase row (e.g. SUPABASE_SERVICE_ROLE_KEY missing or broken), so the
   user can still see what their card looks like. Save/Share aren't wired
   here because they need a server-side PNG endpoint with a real
   session_token. Documented inline. */

export default function CardPreviewPage() {
  const router = useRouter();
  const { result, name, birthDate, isPaid } = useSajuStore();

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
        <p className={s.eyebrow}>Preview · Dev mode</p>

        <div className={s.cardFrame}>
          <div className={s.cardScale}>
            <SajuCard
              name={displayName}
              birthDate={birthDate}
              sajuResult={result}
              archetypeText={archetypeText}
            />
          </div>
        </div>

        {/* Save / Share require a persisted Supabase row (session_token).
            Surface that requirement clearly instead of stubbing buttons that
            would 404. The production path with proper SUPABASE_* env vars
            routes through /card/[session_token] which has working buttons. */}
        <p className={s.previewHint}>
          Save &amp; share will activate once payments are connected. For now,
          take a screenshot to keep your card.
        </p>
      </section>
    </main>
  );
}
