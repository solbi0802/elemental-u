'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSajuStore } from '@/lib/store';
import { calculateSaju } from '@/lib/saju/calculator';
import type { SajuResult } from '@/lib/saju/types';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import { PreviewActions } from './PreviewActions';
import * as s from '../[session_token]/page.css';

/* Card preview that works without a Supabase row. State comes from one
   of two sources, in order of preference:

   1. URL search params (?n=…&d=YYYY-MM-DD&t=HH:MM). Paywall builds these
      when sending the user here in dev mode. The page parses them and
      recomputes saju client-side via calculateSaju, so each user gets a
      short, shareable URL — recipients open it and see the sender's
      card without any database lookup.

   2. Zustand store — for same-tab navigation from Paywall where the
      query params weren't built.

   No state means we redirect to / so the user can fill the form first. */

interface CardState {
  name: string;
  birthDate: string;
  sajuResult: SajuResult;
}

function safeCalculate(birthDate: string, birthTime: string | null): SajuResult | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;
  const [year, month, day] = birthDate.split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  try {
    return calculateSaju(year, month, day, birthTime);
  } catch {
    return null;
  }
}

function CardPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeState = useSajuStore();
  const cardScaleRef = useRef<HTMLDivElement>(null);

  const state: CardState | null = useMemo(() => {
    const paramDate = searchParams.get('d');
    if (paramDate) {
      const sajuResult = safeCalculate(paramDate, searchParams.get('t') ?? null);
      if (sajuResult) {
        return {
          name: searchParams.get('n') || 'Anonymous',
          birthDate: paramDate,
          sajuResult,
        };
      }
    }
    if (storeState.result && storeState.birthDate && storeState.isPaid) {
      return {
        name: storeState.name || 'Anonymous',
        birthDate: storeState.birthDate,
        sajuResult: storeState.result,
      };
    }
    return null;
  }, [
    searchParams,
    storeState.result,
    storeState.birthDate,
    storeState.isPaid,
    storeState.name,
  ]);

  useEffect(() => {
    if (!state) router.replace('/');
  }, [state, router]);

  if (!state) return null;

  const archetypeText = buildArchetypeText(
    state.sajuResult.dominantElement,
    state.sajuResult.dayMaster,
  );

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
              name={state.name}
              birthDate={state.birthDate}
              sajuResult={state.sajuResult}
              archetypeText={archetypeText}
            />
          </div>
        </div>

        <PreviewActions cardRef={cardScaleRef} cardName={state.name} />
      </section>
    </main>
  );
}

/* useSearchParams() requires a <Suspense> boundary in production builds
   so Next.js can defer prerender for routes that read query params. */
export default function CardPreviewPage() {
  return (
    <Suspense fallback={null}>
      <CardPreviewContent />
    </Suspense>
  );
}
