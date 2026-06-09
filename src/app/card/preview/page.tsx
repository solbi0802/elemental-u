'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import { PreviewActions } from './PreviewActions';
import * as s from '../[session_token]/page.css';

export default function CardPreviewPage() {
  const router = useRouter();
  const { result, birthDate, name } = useSajuStore();
  const cardScaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result || !birthDate) router.replace('/');
  }, [result, birthDate, router]);

  if (!result || !birthDate) return null;

  const cardName = name || 'Anonymous';
  const archetypeText = buildArchetypeText(
    result.dominantElement,
    result.dayMaster,
  );

  return (
    <main className={s.page}>
      <header className={s.header}>
        <Link href="/" className={s.brandLink}>
          Elemental-U
        </Link>
      </header>

      <section className={s.cardSection}>
        <h1 className={s.subtitle}>Your destiny card</h1>
        <p className={s.eyebrow}>Four Pillars · Save or share privately</p>

        <div className={s.cardFrame}>
          <div className={s.cardScale} ref={cardScaleRef}>
            <SajuCard
              name={cardName}
              birthDate={birthDate}
              sajuResult={result}
              archetypeText={archetypeText}
            />
          </div>
        </div>

        <PreviewActions cardRef={cardScaleRef} cardName={cardName} />
      </section>
    </main>
  );
}
