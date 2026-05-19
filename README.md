# Elemental-U

A Korean Four Pillars (`四柱命理`) destiny reading service for English-speaking
users. Built with Next.js 16, vanilla-extract, Zustand, Gemini, Lemon Squeezy,
and Supabase.

## Quick start

```bash
npm install
cp .env.example .env.local      # then fill in real values — see below
npm run dev
```

## Environment setup

All four services in `.env.example` need accounts before payments work
end-to-end. The app degrades gracefully without them:

| Service | What stops working if missing |
| --- | --- |
| `GEMINI_API_KEY` | Readings never generate. Paywall stays in Unavailable state after payment. |
| `LEMONSQUEEZY_*` | `/api/payment/checkout` returns 502. Paywall CTA shows an error. |
| `SUPABASE_*` | All payment routes return 500. Free flow (chart only) still works. |
| `NEXT_PUBLIC_SITE_URL` | LS redirect URL points at request origin instead — works locally but breaks behind tunnels. |

### Supabase

1. New project at supabase.com (any region).
2. In **SQL Editor**, paste and run `supabase/migrations/0001_purchases.sql`.
3. **Settings → API** → copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role secret** (NOT the anon key) → `SUPABASE_SERVICE_ROLE_KEY`

### Lemon Squeezy

1. Sign up at lemonsqueezy.com (individual account fine — no business
   registration needed).
2. Create a **Store**.
3. Create a **Product** named "Elemental-U Complete Reading" priced at $2.99.
   Note the **Variant ID** from the variant page URL.
4. **Settings → API** → create an API key → `LEMONSQUEEZY_API_KEY`.
5. **Store overview** → `LEMONSQUEEZY_STORE_ID`.
6. **Settings → Webhooks** → add a webhook:
   - URL: `https://<your-domain>/api/payment/webhook`
     (use `ngrok http 3000` and the ngrok URL for local dev).
   - Events: `order_created` (at minimum).
   - Copy the **signing secret** → `LEMONSQUEEZY_WEBHOOK_SECRET`.

### Gemini

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Free tier covers 1,500 requests/day — plenty for testing.

## Local testing the payment flow

```bash
# Terminal 1
npm run dev

# Terminal 2 — expose localhost for Lemon Squeezy webhooks
ngrok http 3000
# Copy the https URL into the Lemon Squeezy webhook settings.

# Terminal 3 — make sure env is loaded
cat .env.local
```

Then visit http://localhost:3000, fill in the form, click the paywall,
pay with Lemon Squeezy's test card `4242 4242 4242 4242` (any future
expiry, any CVC). The page should redirect back, show the SajuLoader
for a few seconds, then reveal the six readings.

## Common scripts

```bash
npm run dev          # next dev with HMR
npm run build        # production build (also runs tsc --noEmit)
npm run lint         # eslint
npm test             # vitest (saju calculator unit tests)
```

## Architecture

- `src/app/page.tsx` — single client page. Branches between `InputForm`
  and the result view based on the zustand `result` field.
- `src/lib/store.ts` — Zustand store. Holds chart + readings + session
  token. Drives the polling loop after a payment redirect.
- `src/app/api/saju/chart` — pure calculation, no DB, no Gemini.
- `src/app/api/payment/checkout` — inserts a `pending` row, creates an
  LS checkout, returns the hosted URL.
- `src/app/api/payment/webhook` — LS hits this on `order_created`.
  HMAC-verifies, then calls Gemini in `after()` so the response stays
  under Vercel Hobby's 10 s function budget.
- `src/app/api/payment/verify` — client poll target. Returns
  `{ status, readings, saju_result, name, ls_order_id }`.
- `src/app/api/payment/retry-readings` — re-runs Gemini for an
  already-paid session that failed generation. Gated on `ls_order_id`.

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add every variable from `.env.example` to **Project Settings →
   Environment Variables** (Production scope at minimum).
4. Set `NEXT_PUBLIC_SITE_URL` to the Vercel domain.
5. Update the Lemon Squeezy webhook URL to point at the deployed
   domain.
6. Switch LS from test mode to live mode when ready.
