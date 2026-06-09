# Elemental-U

Elemental-U is a free beta for AI-assisted Korean Four Pillars (Saju)
readings. It calculates an elemental chart locally on the server, retrieves
relevant interpretation notes, and asks Gemini to produce six reflective
reading sections.

## Current product flow

1. The user enters a name, birth date, and optional birth time.
2. `/api/saju/chart` returns the calculated Four Pillars chart.
3. The user requests a free full reading.
4. `/api/saju/readings` retrieves relevant knowledge notes and calls Gemini.
5. The result can be read in the app or represented as a shareable destiny
   card.

The public UI does not start a checkout. Legacy Lemon Squeezy routes remain
in the repository only as inactive integration code.

## Local development

```bash
npm install
npm run dev
```

Required environment variable:

```dotenv
GEMINI_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=... # service_role JWT or sb_secret_ server key
RATE_LIMIT_SALT=...
```

Production free readings fail closed unless the Supabase configuration is
valid and `supabase/migrations/0002_reading_rate_limits.sql` has been applied.
The database function provides an atomic rate limit shared by all serverless
instances. Local development uses an in-memory limiter.

## Knowledge-grounded readings

The pilot knowledge base lives in:

```text
src/lib/saju/knowledge.ts
```

Each entry has:

- a stable source ID
- applicable element topics
- a concise interpretation principle
- a human-readable source label

`retrieveKnowledge()` selects chart-relevant entries. The selected notes are
inserted into the Gemini prompt by `src/lib/gemini/prompts.ts`.

The bundled entries are methodology samples, not a finished Saju corpus.
Replace or expand them with summaries from sources the project owns or has
permission to use. Keep source labels and separate conflicting schools of
interpretation instead of blending them silently.

## Analytics

`src/lib/analytics.ts` emits privacy-conscious product events without names,
birth details, or reading text. It supports `gtag`, Plausible, or a custom
`elemental-u:analytics` browser event when a provider is configured.

## Verification

```bash
npm test
npm run lint
npm run build
```

The test suite covers the chart calculator, knowledge retrieval, and
knowledge-context prompt construction.
