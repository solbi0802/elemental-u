import { create } from 'zustand';
import type { SajuResult, SajuReadings } from './saju/types';
import { trackEvent } from './analytics';

interface SajuStore {
  name: string;
  birthDate: string | null;
  birthTime: string | null;
  result: SajuResult | null;
  readings: SajuReadings | null;
  isLoadingChart: boolean;
  isLoadingReadings: boolean;
  error: string | null;
  setInput: (name: string, birthDate: string, birthTime: string | null) => void;
  fetchSaju: () => Promise<void>;
  generateReadings: () => Promise<void>;
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

  setInput: (name, birthDate, birthTime) => {
    set({
      name,
      birthDate,
      birthTime,
      result: null,
      readings: null,
      error: null,
    });
  },

  fetchSaju: async () => {
    const { birthDate, birthTime } = get();
    if (!birthDate) return;

    set({ isLoadingChart: true, error: null });
    trackEvent('chart_requested', { has_birth_time: Boolean(birthTime) });

    try {
      const response = await fetch('/api/saju/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate, birthTime }),
      });
      if (!response.ok) throw new Error('We could not calculate your chart.');

      const data = (await response.json()) as { result: SajuResult };
      set({ result: data.result, isLoadingChart: false });
      trackEvent('chart_generated', {
        day_master: data.result.dayMaster,
        dominant_element: data.result.dominantElement,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoadingChart: false });
    }
  },

  generateReadings: async () => {
    const { name, birthDate, birthTime, isLoadingReadings } = get();
    if (!birthDate || isLoadingReadings) return;

    set({ isLoadingReadings: true, error: null });
    trackEvent('reading_requested');

    try {
      const response = await fetch('/api/saju/readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, birthTime }),
      });
      const data = (await response.json()) as {
        result?: SajuResult;
        readings?: SajuReadings;
        error?: string;
      };

      if (!response.ok || !data.result || !data.readings) {
        throw new Error(data.error || 'We could not generate your reading.');
      }

      set({
        result: data.result,
        readings: data.readings,
        isLoadingReadings: false,
      });
      trackEvent('reading_generated', {
        day_master: data.result.dayMaster,
        dominant_element: data.result.dominantElement,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoadingReadings: false });
      trackEvent('reading_failed');
    }
  },

  reset: () => {
    set({
      name: '',
      birthDate: null,
      birthTime: null,
      result: null,
      readings: null,
      isLoadingChart: false,
      isLoadingReadings: false,
      error: null,
    });
  },
}));
