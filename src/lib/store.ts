import { create } from 'zustand';
import type { SajuResult, SajuReadings } from './saju/types';

interface SajuStore {
  name: string;
  birthDate: string | null;
  birthTime: string | null;
  result: SajuResult | null;
  readings: SajuReadings | null;
  isLoading: boolean;
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
  isLoading: false,
  error: null,
  isPaid: false,

  setInput: (name, birthDate, birthTime) => set({ name, birthDate, birthTime }),

  fetchSaju: async () => {
    const { name, birthDate, birthTime } = get();
    if (!birthDate) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch('/api/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, birthTime }),
      });

      if (!res.ok) throw new Error('Failed to fetch saju reading');

      const data = await res.json();
      set({ result: data.result, readings: data.readings, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  unlockReadings: () => set({ isPaid: true }),

  reset: () =>
    set({
      name: '',
      birthDate: null,
      birthTime: null,
      result: null,
      readings: null,
      isLoading: false,
      error: null,
      isPaid: false,
    }),
}));
