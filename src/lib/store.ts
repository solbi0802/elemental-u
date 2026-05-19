import { create } from 'zustand';
import type { SajuResult, SajuReadings } from './saju/types';

const SESSION_STORAGE_KEY = 'elemental_session';
const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 120_000;

interface SajuStore {
  name: string;
  birthDate: string | null;
  birthTime: string | null;
  result: SajuResult | null;
  readings: SajuReadings | null;
  sessionToken: string | null;
  isLoadingChart: boolean;
  isLoadingReadings: boolean;
  isProcessingPayment: boolean;
  error: string | null;
  isPaid: boolean;

  setInput: (name: string, birthDate: string, birthTime: string | null) => void;
  fetchSaju: () => Promise<void>;
  startCheckout: () => Promise<void>;
  hydrateFromSession: (token: string) => Promise<void>;
  retryReadings: () => Promise<void>;
  reset: () => void;
}

interface VerifyResponse {
  status: 'pending' | 'paid' | 'failed';
  name: string | null;
  saju_result: SajuResult;
  readings: SajuReadings | null;
  ls_order_id: string | null;
}

async function fetchVerify(token: string): Promise<VerifyResponse | null> {
  const res = await fetch(`/api/payment/verify?session_token=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  return (await res.json()) as VerifyResponse;
}

function persistToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(SESSION_STORAGE_KEY, token);
  else window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export const useSajuStore = create<SajuStore>((set, get) => ({
  name: '',
  birthDate: null,
  birthTime: null,
  result: null,
  readings: null,
  sessionToken: null,
  isLoadingChart: false,
  isLoadingReadings: false,
  isProcessingPayment: false,
  error: null,
  isPaid: false,

  /* Submitting new birth data is a fresh start — wipe any stale session
     token, readings, and paid status from a previous abandoned checkout
     so the new chart isn't shadowed by a leftover hydrate cycle. */
  setInput: (name, birthDate, birthTime) => {
    persistToken(null);
    set({
      name,
      birthDate,
      birthTime,
      sessionToken: null,
      readings: null,
      isPaid: false,
      isLoadingReadings: false,
    });
  },

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

  startCheckout: async () => {
    const { name, birthDate, birthTime } = get();
    if (!birthDate) return;

    set({ isProcessingPayment: true, error: null });

    let data: {
      checkout_url?: string;
      session_token?: string | null;
      bypassed?: boolean;
      result?: SajuResult;
      readings?: SajuReadings | null;
    };
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, birthTime }),
      });
      if (!res.ok) throw new Error('Failed to start checkout');
      data = await res.json();
    } catch (err) {
      set({ error: (err as Error).message, isProcessingPayment: false });
      return;
    }

    /* === Dev bypass path ===
       Server returned readings inline because LEMONSQUEEZY_API_KEY isn't
       configured. Flip straight to the Unlocked state without an external
       redirect. The session_token may be null if Supabase also isn't
       configured — the /card flow gracefully degrades in that case. */
    if (data.bypassed) {
      if (data.session_token) {
        persistToken(data.session_token);
      }
      set({
        result: data.result ?? get().result,
        readings: data.readings ?? null,
        sessionToken: data.session_token ?? null,
        isPaid: true,
        isProcessingPayment: false,
        isLoadingReadings: false,
      });
      return;
    }

    /* === Normal Lemon Squeezy redirect path === */
    if (!data.checkout_url || !data.session_token) {
      set({
        error: 'Unexpected checkout response',
        isProcessingPayment: false,
      });
      return;
    }
    persistToken(data.session_token);
    set({ sessionToken: data.session_token });
    window.location.href = data.checkout_url;
  },

  hydrateFromSession: async (token: string) => {
    set({ sessionToken: token, isLoadingReadings: true });

    const started = Date.now();
    while (Date.now() - started < POLL_TIMEOUT_MS) {
      const data = await fetchVerify(token);
      if (!data) {
        /* 404 — token invalid or expired. Clear and return to a fresh form. */
        persistToken(null);
        set({
          sessionToken: null,
          isLoadingReadings: false,
          error: null,
          name: '',
          result: null,
        });
        return;
      }

      if (data.status === 'paid' && data.readings) {
        /* Happy path — payment confirmed, readings ready. Persist so the
           user can refresh and keep seeing their result. */
        persistToken(token);
        set({
          name: data.name ?? '',
          result: data.saju_result,
          readings: data.readings,
          isPaid: true,
          isLoadingReadings: false,
        });
        return;
      }

      if (data.status === 'failed') {
        /* Paid but Gemini failed — show chart + retry CTA. */
        persistToken(token);
        set({
          name: data.name ?? '',
          result: data.saju_result,
          isPaid: true,
          readings: null,
          isLoadingReadings: false,
        });
        return;
      }

      if (!data.ls_order_id) {
        /* User abandoned the checkout — clear stale state and restore the
           fresh form view. Without this, the in-flight pending row would
           keep masking the InputForm with old data. */
        persistToken(null);
        set({
          sessionToken: null,
          isLoadingReadings: false,
          name: '',
          result: null,
        });
        return;
      }

      /* status='pending' && ls_order_id present — webhook is still
         processing. Show the chart while we wait for readings. */
      set({
        name: data.name ?? '',
        result: data.saju_result,
      });
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    /* Hit the overall timeout. Stop the loader but keep the chart visible. */
    set({ isLoadingReadings: false });
  },

  retryReadings: async () => {
    const { sessionToken } = get();
    if (!sessionToken) return;

    set({ isLoadingReadings: true });

    try {
      await fetch('/api/payment/retry-readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken }),
      });
    } catch {
      set({ isLoadingReadings: false });
      return;
    }

    await get().hydrateFromSession(sessionToken);
  },

  reset: () => {
    persistToken(null);
    set({
      name: '',
      birthDate: null,
      birthTime: null,
      result: null,
      readings: null,
      sessionToken: null,
      isLoadingChart: false,
      isLoadingReadings: false,
      isProcessingPayment: false,
      error: null,
      isPaid: false,
    });
  },
}));

export const SESSION_TOKEN_STORAGE_KEY = SESSION_STORAGE_KEY;
