'use client';

import { useSajuStore } from '@/lib/store';
import { InputForm } from '@/components/InputForm/InputForm';
import { ElementChart } from '@/components/ElementChart/ElementChart';
import { Paywall } from '@/components/Paywall/Paywall';
import { Particles } from '@/components/Particles/Particles';
import {
  KoreanPatterns,
  PatternStrip,
  WaveDivider,
} from '@/components/KoreanPatterns/KoreanPatterns';

export default function Home() {
  const { result, readings, name } = useSajuStore();

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

          <PatternStrip />

          <Paywall readings={readings} />
        </>
      )}
    </main>
  );
}
