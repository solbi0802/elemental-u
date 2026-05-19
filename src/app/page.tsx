'use client';

import { useEffect, useRef } from 'react';
import { useSajuStore, SESSION_TOKEN_STORAGE_KEY } from '@/lib/store';
import { InputForm } from '@/components/InputForm/InputForm';
import { ElementChart } from '@/components/ElementChart/ElementChart';
import { ElementTeaser } from '@/components/ElementTeaser/ElementTeaser';
import { Paywall } from '@/components/Paywall/Paywall';
import { Particles } from '@/components/Particles/Particles';
import {
  KoreanPatterns,
  PatternStrip,
  WaveDivider,
} from '@/components/KoreanPatterns/KoreanPatterns';

export default function Home() {
  const { result, readings, name, hydrateFromSession } = useSajuStore();
  const hydratedRef = useRef(false);

  /* On mount: pick up session_token from the LS redirect URL or from a
     previous session in localStorage, then hydrate. The ref guards against
     React StrictMode double-invocation in dev. */
  useEffect(() => {
    if (hydratedRef.current) return;

    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('session');
    const fromStorage = window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    const token = fromQuery || fromStorage;
    if (!token) return;

    hydratedRef.current = true;

    /* Clean the URL so a manual refresh doesn't re-trigger the redirect
       handshake — localStorage continues to hold the token for re-entry. */
    if (fromQuery) {
      url.searchParams.delete('session');
      url.searchParams.delete('paid');
      window.history.replaceState(null, '', url.pathname + url.search);
    }

    void hydrateFromSession(token);
  }, [hydrateFromSession]);

  return (
    <main>
      <Particles />
      <KoreanPatterns />

      {!result ? (
        <>
          <InputForm />
          <PatternStrip />
        </>
      ) : (
        <>
          <ElementChart
            balance={result.elementBalance}
            dominantElement={result.dominantElement}
            dayMaster={result.dayMaster}
            fourPillars={result.fourPillars}
            name={name || 'You'}
          />

          <div style={{ padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <WaveDivider />
          </div>

          <ElementTeaser
            dominantElement={result.dominantElement}
            dayMaster={result.dayMaster}
          />

          <PatternStrip />

          <Paywall readings={readings} />
        </>
      )}
    </main>
  );
}
