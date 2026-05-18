# K-Saju Design Spec

## Overview

K-Saju is an English-language Korean fortune-telling (사주, Four Pillars of Destiny) website targeting Western audiences. Users enter their birth date/time, receive a free Five Elements analysis, and can unlock detailed readings for $0.99.

## Target Audience

- Western users curious about Eastern astrology
- English-speaking audience unfamiliar with Saju terminology
- Users who enjoy personality quizzes, horoscopes, and self-discovery content

## User Flow

Single Page Scroll (Option A):

1. **Landing/Input** — User enters birth date + birth time (optional)
2. **Free Result: Five Elements** — Animated pentagon chart showing element balance with percentages
3. **Paywall** — Remaining 6 readings shown blurred with unlock CTA
4. **Paid Result** — Full readings unlocked after $0.99 payment

## Pages & Sections

### 1. Input Section (Landing)

- Dark cosmic theme (radial gradient background)
- K-SAJU logo + "Four Pillars of Destiny" tagline
- Form fields:
  - Name (text input)
  - Date of Birth (date picker)
  - Time of Birth (time picker, optional)
- CTA button: "Reveal My Destiny"
- No account/signup required

### 2. Free Section: Five Elements Analysis (오행 분석)

- **Pentagon visualization** with the 5 elements arranged in a circle:
  - 🌲 Wood (목) — green
  - 🔥 Fire (화) — red/orange
  - ⛰️ Earth (토) — brown/amber
  - 🪙 Metal (금) — gold
  - 🌊 Water (수) — blue
- Each element shows percentage (%) with animated power bars
- Generating cycle (상생) shown as solid green arrows
- Controlling cycle (상극) shown as dashed red arrows
- Hover/tap each element to see personality traits (e.g., "The Creator", "The Warrior")
- "DOMINANT" badge on the strongest element
- Floating particle effects for visual engagement

### 3. Paywall Section

- 6 locked readings shown as blurred cards:
  - 📜 Life Fortune (사주 총운) — Early, Mid, Late years
  - 🐍 2026 New Year Fortune (신년 운세)
  - 💼 Career Reading (직업운)
  - 💕 Love Reading (사랑운)
  - 🏥 Health Reading (건강운)
  - 💰 Wealth Reading (금전운)
- Blur filter (4-5px) on content to create curiosity
- Unlock CTA: "Get Complete Destiny — $0.99"
- "One-time payment, instant access" subtitle
- Secure payment badge (Lemon Squeezy)

### 4. Paid Sections (unlocked after payment)

Each reading section follows a consistent card layout:
- Section icon + title
- Gemini-generated interpretive text (3-5 paragraphs)
- Key insight callout box
- Relevant element connections highlighted

#### 4a. Life Fortune (사주 총운)
- Divided into: Early Years (초년운), Mid Years (중년운), Late Years (말년운)
- Overall life trajectory narrative

#### 4b. 2026 Fortune (신년 운세)
- Year-specific fortune based on 2026 (丙午년) interaction with birth chart
- Quarterly breakdown (Q1-Q4)

#### 4c. Career Reading (직업운)
- Suitable career paths based on element balance
- Work style and strengths
- Career timing advice

#### 4d. Love Reading (사랑운)
- Relationship patterns
- Compatible element types
- Love timing and advice

#### 4e. Health Reading (건강운)
- Element-based health tendencies
- Areas to watch
- Wellness recommendations

#### 4f. Wealth Reading (금전운)
- Financial tendencies
- Money management style
- Wealth timing and opportunities

## Technical Architecture

### Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Vanilla Extract + Framer Motion |
| Charts | D3.js (custom SVG) |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Saju Calculation | Custom utility (만세력 logic) |
| Saju Interpretation | Gemini API |
| Caching | Vercel KV |
| Payment | Lemon Squeezy (later phase) |
| Deployment | Vercel |

### Saju Calculation Pipeline

```
User Input (birth date/time)
  → 만세력 Calculation (custom TypeScript)
    → 천간 (Heavenly Stems) + 지지 (Earthly Branches)
    → 오행 비율 (Five Element percentages)
  → Gemini API (interpretation)
    → System prompt with Saju framework + tone guide
    → User's 사주 원국 as structured input
    → Temperature: 0.3-0.5 for consistency
  → Vercel KV Cache (key: birth datetime hash)
  → Render results
```

### Gemini API Strategy

- **System prompt**: Defines Saju terminology, interpretation framework, output format, tone (mystical but accessible for Western audience)
- **Input**: Structured 사주 원국 data (천간, 지지, 오행 비율, 일주, 대운)
- **Output format**: JSON with sections for each reading type
- **Caching**: Same birth date/time always returns cached result from Vercel KV
- **Temperature**: 0.3-0.5 for consistency
- **Fallback**: Pre-written generic readings if API fails

### Key Components

```
src/
  app/
    page.tsx              — Main single-page layout
    api/
      saju/route.ts       — Saju calculation + Gemini API endpoint
      payment/route.ts    — Lemon Squeezy webhook handler (later)
  components/
    InputForm/            — Birth date/time input with validation
    ElementChart/         — D3.js pentagon visualization
    ElementNode/          — Individual element with hover tooltip
    ReadingCard/          — Reusable reading section card
    Paywall/              — Blur overlay + CTA
    AnimatedReveal/       — Framer Motion unlock animation
  lib/
    saju/
      calculator.ts       — 만세력 calculation logic
      types.ts            — Saju-related TypeScript types
      constants.ts        — 천간/지지/오행 mapping tables
    gemini/
      client.ts           — Gemini API client
      prompts.ts          — System prompts for each reading type
    store.ts              — Zustand store (user input, results, payment state)
```

### State Management (Zustand)

```typescript
interface SajuStore {
  // Input
  birthDate: Date | null;
  birthTime: string | null;
  name: string;

  // Results
  elementBalance: ElementBalance | null;  // Five element percentages
  readings: Readings | null;              // All 7 reading sections
  isLoading: boolean;

  // Payment
  isPaid: boolean;
  paymentId: string | null;

  // Actions
  calculateSaju: () => Promise<void>;
  unlockReadings: () => void;
}
```

## Design System

### Theme

- **Background**: Dark cosmic — `radial-gradient(ellipse, #0f172a, #020617)`
- **Accent primary**: Indigo/Purple — `#818cf8` to `#c084fc`
- **Accent secondary**: Pink — `#ec4899` to `#f472b6`
- **Text primary**: `#e2e8f0`
- **Text secondary**: `#94a3b8`
- **Element colors**:
  - Wood: `#4ade80` (green)
  - Fire: `#f97316` (orange-red)
  - Earth: `#eab308` (amber)
  - Metal: `#ffd700` (gold)
  - Water: `#60a5fa` (blue)

### Animations (Framer Motion)

- Input → Result: Fade up transition
- Element chart: Staggered node appearance + power bar fill
- Paywall blur: Smooth blur removal on payment
- Reading cards: Sequential reveal with slide-up
- Floating particles: Continuous ambient effect

### Responsive

- Mobile-first design
- Single column layout throughout
- Pentagon chart scales to viewport width
- Touch-friendly element tooltips

## Payment Flow (Later Phase)

1. User clicks "Unlock" CTA
2. Lemon Squeezy overlay checkout opens
3. User pays $0.99
4. Webhook confirms payment → server marks session as paid
5. Client receives confirmation → blur removed with animation
6. All reading sections become visible

## SEO & Sharing

- Meta title: "K-Saju — Discover Your Destiny Through Korean Astrology"
- OG image: Dynamic image with user's element chart (later)
- Structured data for rich search results

## Out of Scope (v1)

- User accounts / login
- Multiple language support
- Individual reading purchases (bundle only)
- Social sharing with custom OG images
- Email delivery of results
- Comparison with another person's Saju
