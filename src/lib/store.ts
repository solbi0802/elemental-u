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
  isProcessingPayment: boolean;
  error: string | null;
  isPaid: boolean;

  setInput: (name: string, birthDate: string, birthTime: string | null) => void;
  fetchSaju: () => Promise<void>;
  /* Single entry point that future real-payment integration (Toss/Stripe)
     will hook into. For now it fakes a 600ms processing window then fetches
     readings. The gateway callback would replace the setTimeout. */
  purchaseAndFetchReadings: () => Promise<void>;
  retryReadings: () => Promise<void>;
  reset: () => void;
}

const PAYMENT_SIMULATION_MS = 600;

async function fetchReadingsInternal(name: string, result: SajuResult) {
  const res = await fetch('/api/saju/readings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, result }),
  });
  const data = (await res.json()) as { readings: SajuReadings | null };
  return data.readings ?? null;
}

export const useSajuStore = create<SajuStore>((set, get) => ({
  name: '',
  birthDate: null,
  birthTime: null,
  result: null,
  readings: null,
  isLoadingChart: false,
  isLoadingReadings: false,
  isProcessingPayment: false,
  error: null,
  isPaid: false,

  setInput: (name, birthDate, birthTime) => set({ name, birthDate, birthTime }),

  /* Chart only — readings are NOT fetched here. They're gated behind payment. */
  fetchSaju: async () => {
    const { birthDate, birthTime } = get();
    if (!birthDate) return;

    set({ isLoadingChart: true, error: null });

    try {
      const chartRes = await fetch('/api/saju/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime }),
      });
      if (!chartRes.ok) throw new Error('Failed to compute chart');
      const chartData = (await chartRes.json()) as { result: SajuResult };
      set({ result: chartData.result, isLoadingChart: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoadingChart: false });
    }
  },

  purchaseAndFetchReadings: async () => {
    const { name, result } = get();
    if (!result) return;

    /* Step 1: simulate payment processing. A real gateway callback would
       replace this delay and only proceed on confirmation. */
    set({ isProcessingPayment: true });
    await new Promise((resolve) => setTimeout(resolve, PAYMENT_SIMULATION_MS));

    /* Step 2: payment "succeeded" — flip to paid state and begin Gemini fetch. */
    set({ isProcessingPayment: false, isPaid: true, isLoadingReadings: true });

    try {
      const readings = await fetchReadingsInternal(name, result);
      set({ readings, isLoadingReadings: false });
    } catch {
      set({ readings: null, isLoadingReadings: false });
    }
  },

  retryReadings: async () => {
    const { name, result } = get();
    if (!result) return;
    set({ isLoadingReadings: true });
    try {
      const readings = await fetchReadingsInternal(name, result);
      set({ readings, isLoadingReadings: false });
    } catch {
      set({ readings: null, isLoadingReadings: false });
    }
  },

  reset: () =>
    set({
      name: '',
      birthDate: null,
      birthTime: null,
      result: null,
      readings: null,
      isLoadingChart: false,
      isLoadingReadings: false,
      isProcessingPayment: false,
      error: null,
      isPaid: false,
    }),
}));
