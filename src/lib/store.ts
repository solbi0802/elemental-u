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
  /* Real entry point — creates a pending purchase row server-side, then
     redirects the browser to the Lemon Squeezy hosted checkout. */
  startCheckout: () => Promise<void>;
  /* Called from page.tsx on mount when ?session=... or localStorage has a
     token. Fetches /api/payment/verify, hydrates the store, and polls until
     readings appear (or timeout). */
  hydrateFromSession: (token: string) => Promise<void>;
  /* "Try again" after a failed Gemini generation. Already paid — only
     re-runs Gemini. */
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

  setInput: (name, birthDate, birthTime) => set({ name, birthDate, birthTime }),

  /* Chart only — readings stay gated behind payment. */
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

    let data: { checkout_url: string; session_token: string };
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, birthTime }),
      });
      if (!res.ok) throw new Error('Failed to start checkout');
      data = (await res.json()) as { checkout_url: string; session_token: string };
    } catch (err) {
      set({ error: (err as Error).message, isProcessingPayment: false });
      return;
    }

    /* Persist token before redirecting — if the user kills the LS tab and
       reopens our site, the home page will find this and resume. */
    persistToken(data.session_token);
    set({ sessionToken: data.session_token });
    window.location.href = data.checkout_url;
  },

  hydrateFromSession: async (token: string) => {
    set({ sessionToken: token, isLoadingReadings: true });
    persistToken(token);

    const started = Date.now();
    while (Date.now() - started < POLL_TIMEOUT_MS) {
      const data = await fetchVerify(token);
      if (!data) {
        /* 404 — the token is invalid or expired. Clear and give up. */
        persistToken(null);
        set({
          sessionToken: null,
          isLoadingReadings: false,
          error: 'Session not found',
        });
        return;
      }

      /* Always restore the saju chart and name on first hit so the page
         can render ElementChart immediately while we keep polling for
         readings. */
      set({
        name: data.name ?? '',
        result: data.saju_result,
      });

      if (data.status === 'paid' && data.readings) {
        set({
          readings: data.readings,
          isPaid: true,
          isLoadingReadings: false,
        });
        return;
      }

      if (data.status === 'failed') {
        set({
          isPaid: true,
          readings: null,
          isLoadingReadings: false,
        });
        return;
      }

      /* Still pending. If ls_order_id is missing, the user abandoned the
         checkout (we have a pending row but no payment). Stop polling and
         leave them in the locked Paywall state. */
      if (!data.ls_order_id) {
        set({ isLoadingReadings: false });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    /* Hit the overall timeout — keep state hydrated but stop the loader so
       the UI doesn't spin forever. */
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
      /* Network failure on the retry trigger itself — just stop spinning. */
      set({ isLoadingReadings: false });
      return;
    }

    /* Reuse the polling loop to wait for the row to flip to paid+readings. */
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
