import { create } from 'zustand';
import type { SajuResult, SajuReadings } from './saju/types';

interface SajuStore {
  name: string;
  birthDate: string | null;
  birthTime: string | null;
  result: SajuResult | null;
  readings: SajuReadings | null;
  isLoadingChart: boolean;
  isLoadingReadings: boolean;
  error: string | null;
  isPaid: boolean;

  setInput: (name: string, birthDate: string, birthTime: string | null) => void;
  fetchSaju: () => Promise<void>;
  unlockReadings: () => void;
  reset: () => void;
}

export const useSajuStore = create<SajuStore>((set, get) => ({
  name: '',
  birthDate: null,
  birthTime: null,
  result: null,
  readings: null,
  isLoadingChart: false,
  isLoadingReadings: false,
  error: null,
  isPaid: false,

  setInput: (name, birthDate, birthTime) => set({ name, birthDate, birthTime }),

  /* Two-step flow: chart resolves fast (~50ms), readings stream in the
     background while the user explores the chart. */
  fetchSaju: async () => {
    const { name, birthDate, birthTime } = get();
    if (!birthDate) return;

    set({ isLoadingChart: true, isLoadingReadings: true, error: null });

    let result: SajuResult;
    try {
      const chartRes = await fetch('/api/saju/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime }),
      });
      if (!chartRes.ok) throw new Error('Failed to compute chart');
      const chartData = (await chartRes.json()) as { result: SajuResult };
      result = chartData.result;
      set({ result, isLoadingChart: false });
    } catch (err) {
      set({
        error: (err as Error).message,
        isLoadingChart: false,
        isLoadingReadings: false,
      });
      return;
    }

    /* Fire-and-forget — does not block the chart from rendering. */
    fetch('/api/saju/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, result }),
    })
      .then((res) => res.json())
      .then((data: { readings: SajuReadings | null }) => {
        set({ readings: data.readings ?? null, isLoadingReadings: false });
      })
      .catch(() => {
        set({ readings: null, isLoadingReadings: false });
      });
  },

  unlockReadings: () => set({ isPaid: true }),

  reset: () =>
    set({
      name: '',
      birthDate: null,
      birthTime: null,
      result: null,
      readings: null,
      isLoadingChart: false,
      isLoadingReadings: false,
      error: null,
      isPaid: false,
    }),
}));
