# K-Saju Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an English-language Korean fortune-telling (사주) single-page website where users get a free Five Elements analysis and can unlock detailed readings for $0.99.

**Architecture:** Next.js 14 App Router with a single-page scroll layout. The saju calculation (천간/지지/오행) runs server-side via a Route Handler, which also calls Gemini API for interpretive text. Results are cached in Vercel KV by birth datetime hash. Client uses Zustand for state and Framer Motion for animations.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Vanilla Extract, Framer Motion, D3.js, Zustand, React Hook Form + Zod, Gemini API, Vercel KV

---

## File Structure

```
k-saju/
  src/
    app/
      layout.tsx                    — Root layout with fonts, metadata, global styles
      page.tsx                      — Main single-page: Input → Elements → Paywall → Readings
      api/
        saju/
          route.ts                  — POST handler: calculate saju + call Gemini + cache
      globals.css                   — CSS reset, body background
    components/
      InputForm/
        InputForm.tsx               — Birth date/time form with react-hook-form + zod
        InputForm.css.ts            — Vanilla Extract styles
      ElementChart/
        ElementChart.tsx            — D3.js pentagon SVG with 5 elements + arrows
        ElementChart.css.ts         — Vanilla Extract styles
      ElementNode/
        ElementNode.tsx             — Single element circle with hover tooltip
        ElementNode.css.ts          — Vanilla Extract styles
      Particles/
        Particles.tsx               — Floating emoji particles background
        Particles.css.ts            — Vanilla Extract styles
      ReadingCard/
        ReadingCard.tsx             — Reusable card for each fortune section
        ReadingCard.css.ts          — Vanilla Extract styles
      Paywall/
        Paywall.tsx                 — Blur overlay + unlock CTA
        Paywall.css.ts              — Vanilla Extract styles
    lib/
      saju/
        types.ts                    — TypeScript types (HeavenlyStem, EarthlyBranch, Element, etc.)
        constants.ts                — Stem/branch/element mapping tables, 60 甲子 cycle
        calculator.ts               — 만세력 calculation: date → four pillars → element balance
        calculator.test.ts          — Unit tests for calculator
      gemini/
        client.ts                   — Gemini API wrapper
        prompts.ts                  — System prompt + per-section prompt builders
        types.ts                    — Gemini response types
      store.ts                      — Zustand store
    styles/
      theme.css.ts                  — Vanilla Extract theme (colors, spacing, fonts)
      animations.ts                 — Framer Motion variants
  next.config.ts                    — Next.js config with vanilla-extract plugin
  tsconfig.json
  package.json
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/solbi/k-saju
npx create-next-app@latest . --typescript --app --src-dir --tailwind=false --eslint --import-alias="@/*" --use-npm
```

Select defaults when prompted. If directory is not empty, allow overwrite.

- [ ] **Step 2: Install all dependencies**

```bash
npm install @vanilla-extract/css @vanilla-extract/next-plugin framer-motion d3 zustand react-hook-form @hookform/resolvers zod @google/generative-ai
npm install -D @types/d3 @vanilla-extract/webpack-plugin vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure next.config.ts for Vanilla Extract**

Replace `next.config.ts` with:

```typescript
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  reactStrictMode: true,
};

export default withVanillaExtract(nextConfig);
```

- [ ] **Step 4: Configure vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Set up globals.css**

Replace `src/app/globals.css`:

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: radial-gradient(ellipse at center, #0f172a 0%, #020617 100%);
  color: #e2e8f0;
  font-family: var(--font-sans);
  min-height: 100vh;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 6: Set up root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'K-Saju — Discover Your Destiny Through Korean Astrology',
  description:
    'Unlock your Four Pillars of Destiny with ancient Korean astrology. Get personalized Five Elements analysis, life fortune, career, love, and health readings.',
  keywords: ['saju', 'korean astrology', 'four pillars', 'fortune telling', 'five elements'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder page**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>K-SAJU</h1>
    </main>
  );
}
```

- [ ] **Step 8: Verify it runs**

```bash
cd /Users/solbi/k-saju && npm run dev
```

Open `http://localhost:3000` — should show "K-SAJU" centered on dark background.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with vanilla-extract, framer-motion, d3, zustand"
```

---

## Task 2: Vanilla Extract Theme + Framer Motion Variants

**Files:**
- Create: `src/styles/theme.css.ts`, `src/styles/animations.ts`

- [ ] **Step 1: Create theme file**

Create `src/styles/theme.css.ts`:

```typescript
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    bgPrimary: '#020617',
    bgSecondary: '#0f172a',
    bgCard: 'rgba(255, 255, 255, 0.04)',
    bgCardBorder: 'rgba(129, 140, 248, 0.15)',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accentPrimary: '#818cf8',
    accentSecondaryStart: '#c084fc',
    accentSecondaryEnd: '#60a5fa',
    accentPink: '#ec4899',
    wood: '#4ade80',
    fire: '#f97316',
    earth: '#eab308',
    metal: '#ffd700',
    water: '#60a5fa',
    success: '#22c55e',
    controlRed: 'rgba(239, 68, 68, 0.35)',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  font: {
    sans: 'var(--font-sans), system-ui, sans-serif',
  },
});
```

- [ ] **Step 2: Create animation variants**

Create `src/styles/animations.ts`:

```typescript
import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const blurReveal: Variants = {
  locked: { filter: 'blur(5px)', opacity: 0.5 },
  unlocked: { filter: 'blur(0px)', opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add vanilla-extract theme and framer-motion animation variants"
```

---

## Task 3: Saju Types and Constants

**Files:**
- Create: `src/lib/saju/types.ts`, `src/lib/saju/constants.ts`

- [ ] **Step 1: Define types**

Create `src/lib/saju/types.ts`:

```typescript
export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type HeavenlyStem =
  | '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';

export type EarthlyBranch =
  | '자' | '축' | '인' | '묘' | '진' | '사'
  | '오' | '미' | '신' | '유' | '술' | '해';

export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: Element;
  branchElement: Element;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null; // null if birth time not provided
}

export interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface SajuResult {
  fourPillars: FourPillars;
  elementBalance: ElementBalance;
  dayMaster: Element;
  dominantElement: Element;
}

export interface ReadingSection {
  title: string;
  icon: string;
  content: string;
  keyInsight: string;
}

export interface SajuReadings {
  lifeFortune: ReadingSection;
  yearFortune: ReadingSection;
  career: ReadingSection;
  love: ReadingSection;
  health: ReadingSection;
  wealth: ReadingSection;
}

export interface SajuApiResponse {
  result: SajuResult;
  readings: SajuReadings;
}

export interface SajuApiRequest {
  name: string;
  birthDate: string; // ISO date string YYYY-MM-DD
  birthTime: string | null; // HH:mm or null
}

export const ELEMENT_META: Record<Element, { emoji: string; label: string; color: string; archetype: string; traits: string[] }> = {
  wood:  { emoji: '🌲', label: 'Wood',  color: '#4ade80', archetype: 'The Creator',    traits: ['Creative', 'Patient', 'Resilient', 'Visionary'] },
  fire:  { emoji: '🔥', label: 'Fire',  color: '#f97316', archetype: 'The Warrior',    traits: ['Passionate', 'Bold', 'Charismatic', 'Dynamic'] },
  earth: { emoji: '⛰️', label: 'Earth', color: '#eab308', archetype: 'The Guardian',   traits: ['Reliable', 'Nurturing', 'Grounded', 'Loyal'] },
  metal: { emoji: '🪙', label: 'Metal', color: '#ffd700', archetype: 'The Strategist', traits: ['Decisive', 'Focused', 'Disciplined', 'Ambitious'] },
  water: { emoji: '🌊', label: 'Water', color: '#60a5fa', archetype: 'The Sage',       traits: ['Wise', 'Adaptable', 'Intuitive', 'Empathetic'] },
};
```

- [ ] **Step 2: Define constants**

Create `src/lib/saju/constants.ts`:

```typescript
import type { HeavenlyStem, EarthlyBranch, Element } from './types';

// 천간 (Heavenly Stems) — 10 stems
export const HEAVENLY_STEMS: HeavenlyStem[] = [
  '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계',
];

// 지지 (Earthly Branches) — 12 branches
export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  '자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해',
];

// 천간 → 오행 mapping
export const STEM_TO_ELEMENT: Record<HeavenlyStem, Element> = {
  '갑': 'wood',  '을': 'wood',
  '병': 'fire',  '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water',
};

// 지지 → 오행 mapping
export const BRANCH_TO_ELEMENT: Record<EarthlyBranch, Element> = {
  '인': 'wood',  '묘': 'wood',
  '사': 'fire',  '오': 'fire',
  '진': 'earth', '술': 'earth', '축': 'earth', '미': 'earth',
  '신': 'metal', '유': 'metal',
  '해': 'water', '자': 'water',
};

// 천간 English names
export const STEM_NAMES: Record<HeavenlyStem, string> = {
  '갑': 'Gap (Yang Wood)',    '을': 'Eul (Yin Wood)',
  '병': 'Byeong (Yang Fire)', '정': 'Jeong (Yin Fire)',
  '무': 'Mu (Yang Earth)',    '기': 'Gi (Yin Earth)',
  '경': 'Gyeong (Yang Metal)','신': 'Sin (Yin Metal)',
  '임': 'Im (Yang Water)',    '계': 'Gye (Yin Water)',
};

// 지지 English names
export const BRANCH_NAMES: Record<EarthlyBranch, string> = {
  '자': 'Ja (Rat)',    '축': 'Chuk (Ox)',    '인': 'In (Tiger)',
  '묘': 'Myo (Rabbit)','진': 'Jin (Dragon)', '사': 'Sa (Snake)',
  '오': 'O (Horse)',   '미': 'Mi (Goat)',    '신': 'Sin (Monkey)',
  '유': 'Yu (Rooster)','술': 'Sul (Dog)',    '해': 'Hae (Pig)',
};

// 월건 (Month stem) lookup: yearStemIndex (0-4, repeating every 5) → first month stem index
// 갑/기 → 병인월, 을/경 → 무인월, 병/신 → 경인월, 정/임 → 임인월, 무/계 → 갑인월
export const MONTH_STEM_START: number[] = [2, 4, 6, 8, 0];

// 시간 → 지지 mapping (24h → 12 branches)
export const HOUR_TO_BRANCH_INDEX: (hour: number) => number = (hour: number) => {
  // 자시(23-01), 축시(01-03), ..., 해시(21-23)
  return Math.floor(((hour + 1) % 24) / 2);
};

// 시두 (Hour stem) lookup: dayStemIndex (0-4, repeating every 5) → first hour stem index
export const HOUR_STEM_START: number[] = [0, 2, 4, 6, 8];

// Reference date for day pillar calculation
// 1900-01-01 was 갑자일 (index 0 in the 60-day cycle)
export const REFERENCE_DATE = new Date(1900, 0, 1);
export const REFERENCE_DAY_INDEX = 0;

// 절기 (Solar terms) approximate month boundaries
// Month 1 (인월) starts around Feb 4, Month 2 (묘월) around Mar 6, etc.
export const SOLAR_MONTH_STARTS: [number, number][] = [
  [2, 4],   // Month 1 (인월) — Feb 4
  [3, 6],   // Month 2 (묘월) — Mar 6
  [4, 5],   // Month 3 (진월) — Apr 5
  [5, 6],   // Month 4 (사월) — May 6
  [6, 6],   // Month 5 (오월) — Jun 6
  [7, 7],   // Month 6 (미월) — Jul 7
  [8, 7],   // Month 7 (신월) — Aug 7
  [9, 8],   // Month 8 (유월) — Sep 8
  [10, 8],  // Month 9 (술월) — Oct 8
  [11, 7],  // Month 10 (해월) — Nov 7
  [12, 7],  // Month 11 (자월) — Dec 7
  [1, 6],   // Month 12 (축월) — Jan 6
];
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/saju/
git commit -m "feat: add saju types and constants (stems, branches, elements)"
```

---

## Task 4: Saju Calculator with Tests

**Files:**
- Create: `src/lib/saju/calculator.ts`, `src/lib/saju/calculator.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/saju/calculator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateFourPillars, calculateElementBalance, calculateSaju } from './calculator';

describe('calculateFourPillars', () => {
  it('calculates year pillar correctly for 1994-03-15', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    // 1994 = 갑술년 (index: (1994 - 4) % 10 = 0 → 갑, (1994 - 4) % 12 = 10 → 술)
    expect(pillars.year.stem).toBe('갑');
    expect(pillars.year.branch).toBe('술');
    expect(pillars.year.stemElement).toBe('wood');
  });

  it('calculates month pillar correctly for March (묘월)', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    // March 15 falls in 묘월 (Month 2)
    // 갑년 → month stem starts at 병(2), month 2 = 정묘
    expect(pillars.month.branch).toBe('묘');
  });

  it('calculates day pillar based on reference date', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    // Day pillar is deterministic from the reference date
    expect(pillars.day.stem).toBeDefined();
    expect(pillars.day.branch).toBeDefined();
  });

  it('returns null hour pillar when no birth time', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    expect(pillars.hour).toBeNull();
  });

  it('calculates hour pillar when birth time provided', () => {
    const pillars = calculateFourPillars(1994, 3, 15, '14:30');
    expect(pillars.hour).not.toBeNull();
    // 14:30 → 미시 (index 7)
    expect(pillars.hour!.branch).toBe('미');
  });
});

describe('calculateElementBalance', () => {
  it('returns percentages that sum to 100', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    const balance = calculateElementBalance(pillars);
    const sum = balance.wood + balance.fire + balance.earth + balance.metal + balance.water;
    expect(Math.round(sum)).toBe(100);
  });

  it('has no negative values', () => {
    const pillars = calculateFourPillars(1994, 3, 15, '14:30');
    const balance = calculateElementBalance(pillars);
    expect(balance.wood).toBeGreaterThanOrEqual(0);
    expect(balance.fire).toBeGreaterThanOrEqual(0);
    expect(balance.earth).toBeGreaterThanOrEqual(0);
    expect(balance.metal).toBeGreaterThanOrEqual(0);
    expect(balance.water).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateSaju', () => {
  it('returns complete SajuResult', () => {
    const result = calculateSaju(1994, 3, 15, '14:30');
    expect(result.fourPillars).toBeDefined();
    expect(result.elementBalance).toBeDefined();
    expect(result.dayMaster).toBeDefined();
    expect(result.dominantElement).toBeDefined();
  });

  it('identifies the dominant element correctly', () => {
    const result = calculateSaju(1994, 3, 15, null);
    const balance = result.elementBalance;
    const maxElement = (Object.entries(balance) as [string, number][])
      .sort((a, b) => b[1] - a[1])[0][0];
    expect(result.dominantElement).toBe(maxElement);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/solbi/k-saju && npx vitest run src/lib/saju/calculator.test.ts
```

Expected: FAIL — module `./calculator` not found.

- [ ] **Step 3: Implement calculator**

Create `src/lib/saju/calculator.ts`:

```typescript
import type { FourPillars, Pillar, ElementBalance, Element, SajuResult, HeavenlyStem, EarthlyBranch } from './types';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_TO_ELEMENT,
  BRANCH_TO_ELEMENT,
  MONTH_STEM_START,
  HOUR_TO_BRANCH_INDEX,
  HOUR_STEM_START,
  REFERENCE_DATE,
  REFERENCE_DAY_INDEX,
  SOLAR_MONTH_STARTS,
} from './constants';

function makePillar(stemIndex: number, branchIndex: number): Pillar {
  const stem = HEAVENLY_STEMS[((stemIndex % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[((branchIndex % 12) + 12) % 12];
  return {
    stem,
    branch,
    stemElement: STEM_TO_ELEMENT[stem],
    branchElement: BRANCH_TO_ELEMENT[branch],
  };
}

function getSolarMonth(month: number, day: number): number {
  // Determine which solar month (절기 기준) the date falls in
  // Returns 0-11 index into SOLAR_MONTH_STARTS (which maps to 인월=0, 묘월=1, ...)
  for (let i = SOLAR_MONTH_STARTS.length - 1; i >= 0; i--) {
    const [m, d] = SOLAR_MONTH_STARTS[i];
    if (month > m || (month === m && day >= d)) {
      return i;
    }
  }
  // Before Jan 6 → still 축월 (index 11)
  return 11;
}

function getDaysBetween(date1: Date, date2: Date): number {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  time: string | null
): FourPillars {
  // === Year Pillar ===
  // The sexagenary cycle: stem = (year - 4) % 10, branch = (year - 4) % 12
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  const yearPillar = makePillar(yearStemIdx, yearBranchIdx);

  // Check if date is before 입춘 (Feb 4) — if so, use previous year
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }
  const effYearStemIdx = (effectiveYear - 4) % 10;
  const effYearBranchIdx = (effectiveYear - 4) % 12;
  const effectiveYearPillar = makePillar(effYearStemIdx, effYearBranchIdx);

  // === Month Pillar ===
  const solarMonthIdx = getSolarMonth(month, day);
  const monthBranchIdx = (solarMonthIdx + 2) % 12; // 인월=2(인)
  const monthStemStart = MONTH_STEM_START[effYearStemIdx % 5];
  const monthStemIdx = (monthStemStart + solarMonthIdx) % 10;
  const monthPillar = makePillar(monthStemIdx, monthBranchIdx);

  // === Day Pillar ===
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = getDaysBetween(REFERENCE_DATE, targetDate);
  const dayIdx = ((REFERENCE_DAY_INDEX + daysDiff) % 60 + 60) % 60;
  const dayStemIdx = dayIdx % 10;
  const dayBranchIdx = dayIdx % 12;
  const dayPillar = makePillar(dayStemIdx, dayBranchIdx);

  // === Hour Pillar ===
  let hourPillar: Pillar | null = null;
  if (time) {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const hourBranchIdx = HOUR_TO_BRANCH_INDEX(hour);
    const hourStemStart = HOUR_STEM_START[dayStemIdx % 5];
    const hourStemIdx = (hourStemStart + hourBranchIdx) % 10;
    hourPillar = makePillar(hourStemIdx, hourBranchIdx);
  }

  return {
    year: effectiveYearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}

export function calculateElementBalance(pillars: FourPillars): ElementBalance {
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const activePillars = [pillars.year, pillars.month, pillars.day];
  if (pillars.hour) activePillars.push(pillars.hour);

  // Each pillar contributes 2 elements (stem + branch)
  for (const pillar of activePillars) {
    counts[pillar.stemElement] += 1;
    counts[pillar.branchElement] += 1;
  }

  // Convert to percentages
  const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  const balance: ElementBalance = {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  // Adjust rounding to ensure sum = 100
  const sum = balance.wood + balance.fire + balance.earth + balance.metal + balance.water;
  if (sum !== 100) {
    const maxKey = (Object.entries(balance) as [Element, number][])
      .sort((a, b) => b[1] - a[1])[0][0];
    balance[maxKey] += 100 - sum;
  }

  return balance;
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  time: string | null
): SajuResult {
  const fourPillars = calculateFourPillars(year, month, day, time);
  const elementBalance = calculateElementBalance(fourPillars);
  const dayMaster = fourPillars.day.stemElement;
  const dominantElement = (Object.entries(elementBalance) as [Element, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  return { fourPillars, elementBalance, dayMaster, dominantElement };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/solbi/k-saju && npx vitest run src/lib/saju/calculator.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/saju/
git commit -m "feat: implement saju calculator with four pillars and element balance"
```

---

## Task 5: Zustand Store

**Files:**
- Create: `src/lib/store.ts`

- [ ] **Step 1: Create the store**

Create `src/lib/store.ts`:

```typescript
import { create } from 'zustand';
import type { SajuResult, SajuReadings } from './saju/types';

interface SajuStore {
  // Input
  name: string;
  birthDate: string | null;
  birthTime: string | null;

  // Results
  result: SajuResult | null;
  readings: SajuReadings | null;
  isLoading: boolean;
  error: string | null;

  // Payment
  isPaid: boolean;

  // Actions
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/store.ts
git commit -m "feat: add zustand store for saju state management"
```

---

## Task 6: Gemini API Client and Prompts

**Files:**
- Create: `src/lib/gemini/types.ts`, `src/lib/gemini/prompts.ts`, `src/lib/gemini/client.ts`

- [ ] **Step 1: Create Gemini response types**

Create `src/lib/gemini/types.ts`:

```typescript
export interface GeminiReadingResponse {
  lifeFortune: {
    content: string;
    keyInsight: string;
  };
  yearFortune: {
    content: string;
    keyInsight: string;
  };
  career: {
    content: string;
    keyInsight: string;
  };
  love: {
    content: string;
    keyInsight: string;
  };
  health: {
    content: string;
    keyInsight: string;
  };
  wealth: {
    content: string;
    keyInsight: string;
  };
}
```

- [ ] **Step 2: Create prompt builders**

Create `src/lib/gemini/prompts.ts`:

```typescript
import type { SajuResult } from '../saju/types';
import { STEM_NAMES, BRANCH_NAMES } from '../saju/constants';

function pillarToString(pillar: { stem: string; branch: string }): string {
  const stemName = STEM_NAMES[pillar.stem as keyof typeof STEM_NAMES] || pillar.stem;
  const branchName = BRANCH_NAMES[pillar.branch as keyof typeof BRANCH_NAMES] || pillar.branch;
  return `${stemName} + ${branchName}`;
}

export const SYSTEM_PROMPT = `You are a master Korean Saju (四柱) astrologer who explains readings in English for a Western audience. Your tone is mystical yet warm and accessible — like a wise mentor revealing cosmic secrets.

Rules:
- Never use Korean terms without an English explanation
- Write in second person ("You are...", "Your energy...")
- Be specific and personal, not generic horoscope filler
- Each section should be 3-4 paragraphs
- Use vivid metaphors related to the elements (nature, seasons, forces)
- Be encouraging but honest about challenges
- Include actionable advice where appropriate

Output MUST be valid JSON matching this exact structure:
{
  "lifeFortune": { "content": "...", "keyInsight": "..." },
  "yearFortune": { "content": "...", "keyInsight": "..." },
  "career": { "content": "...", "keyInsight": "..." },
  "love": { "content": "...", "keyInsight": "..." },
  "health": { "content": "...", "keyInsight": "..." },
  "wealth": { "content": "...", "keyInsight": "..." }
}

Each "content" should be 3-4 paragraphs of interpretation.
Each "keyInsight" should be 1-2 sentences — the most important takeaway.`;

export function buildUserPrompt(name: string, result: SajuResult): string {
  const { fourPillars, elementBalance, dayMaster, dominantElement } = result;

  let prompt = `Please provide a complete Saju reading for ${name}.

## Four Pillars (사주 원국)
- Year Pillar: ${pillarToString(fourPillars.year)}
- Month Pillar: ${pillarToString(fourPillars.month)}
- Day Pillar: ${pillarToString(fourPillars.day)} (Day Master: ${dayMaster})`;

  if (fourPillars.hour) {
    prompt += `\n- Hour Pillar: ${pillarToString(fourPillars.hour)}`;
  } else {
    prompt += `\n- Hour Pillar: Unknown (birth time not provided)`;
  }

  prompt += `

## Element Balance
- Wood: ${elementBalance.wood}%
- Fire: ${elementBalance.fire}%
- Earth: ${elementBalance.earth}%
- Metal: ${elementBalance.metal}%
- Water: ${elementBalance.water}%
- Dominant Element: ${dominantElement}

## Sections to cover:
1. **Life Fortune (총운)**: Divide into Early Years (teens-20s), Mid Years (30s-50s), Late Years (60s+). What is their overall life trajectory?
2. **2026 Fortune (신년운세)**: The year 2026 is 丙午 (Fire Horse). How does this year's energy interact with their chart? Give quarterly highlights (Q1-Q4).
3. **Career**: What career paths suit their element balance? Work style strengths and timing advice.
4. **Love**: Relationship patterns, compatible element types, and romantic timing.
5. **Health**: Element-based health tendencies, vulnerable areas, and wellness advice.
6. **Wealth**: Financial tendencies, money management style, and wealth opportunities.`;

  return prompt;
}
```

- [ ] **Step 3: Create Gemini client**

Create `src/lib/gemini/client.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GeminiReadingResponse } from './types';
import type { SajuResult } from '../saju/types';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateReadings(
  name: string,
  result: SajuResult
): Promise<GeminiReadingResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const userPrompt = buildUserPrompt(name, result);
  const response = await model.generateContent(userPrompt);
  const text = response.response.text();

  try {
    return JSON.parse(text) as GeminiReadingResponse;
  } catch {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/gemini/
git commit -m "feat: add Gemini API client with saju reading prompts"
```

---

## Task 7: API Route Handler

**Files:**
- Create: `src/app/api/saju/route.ts`

- [ ] **Step 1: Create the route handler**

Create `src/app/api/saju/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { generateReadings } from '@/lib/gemini/client';
import type { SajuApiRequest, SajuReadings } from '@/lib/saju/types';

export async function POST(request: NextRequest) {
  try {
    const body: SajuApiRequest = await request.json();
    const { name, birthDate, birthTime } = body;

    if (!birthDate) {
      return NextResponse.json({ error: 'birthDate is required' }, { status: 400 });
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const result = calculateSaju(year, month, day, birthTime);

    // Generate readings via Gemini
    let readings: SajuReadings;
    try {
      const geminiResponse = await generateReadings(name || 'Friend', result);
      readings = {
        lifeFortune: {
          title: 'Life Fortune',
          icon: '📜',
          content: geminiResponse.lifeFortune.content,
          keyInsight: geminiResponse.lifeFortune.keyInsight,
        },
        yearFortune: {
          title: '2026 Fortune',
          icon: '🐍',
          content: geminiResponse.yearFortune.content,
          keyInsight: geminiResponse.yearFortune.keyInsight,
        },
        career: {
          title: 'Career Reading',
          icon: '💼',
          content: geminiResponse.career.content,
          keyInsight: geminiResponse.career.keyInsight,
        },
        love: {
          title: 'Love Reading',
          icon: '💕',
          content: geminiResponse.love.content,
          keyInsight: geminiResponse.love.keyInsight,
        },
        health: {
          title: 'Health Reading',
          icon: '🏥',
          content: geminiResponse.health.content,
          keyInsight: geminiResponse.health.keyInsight,
        },
        wealth: {
          title: 'Wealth Reading',
          icon: '💰',
          content: geminiResponse.wealth.content,
          keyInsight: geminiResponse.wealth.keyInsight,
        },
      };
    } catch {
      // Fallback: return result without readings if Gemini fails
      return NextResponse.json({
        result,
        readings: null,
        error: 'Reading generation temporarily unavailable',
      });
    }

    return NextResponse.json({ result, readings });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

- [ ] **Step 2: Create .env.local**

Create `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Add `.env.local` to `.gitignore` if not already there.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/saju/route.ts .gitignore
git commit -m "feat: add saju API route with Gemini integration"
```

---

## Task 8: InputForm Component

**Files:**
- Create: `src/components/InputForm/InputForm.tsx`, `src/components/InputForm/InputForm.css.ts`

- [ ] **Step 1: Create styles**

Create `src/components/InputForm/InputForm.css.ts`:

```typescript
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: vars.space.lg,
  textAlign: 'center',
  position: 'relative',
});

export const logo = style({
  fontSize: '36px',
  fontWeight: 800,
  background: `linear-gradient(90deg, ${vars.color.accentSecondaryStart}, ${vars.color.accentSecondaryEnd})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '1px',
});

export const tagline = style({
  fontSize: '13px',
  color: vars.color.textSecondary,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  marginTop: vars.space.xs,
});

export const subtitle = style({
  fontSize: '18px',
  color: vars.color.textPrimary,
  maxWidth: '360px',
  margin: `${vars.space.xl} auto`,
  lineHeight: 1.5,
});

export const accentText = style({
  color: '#a78bfa',
  fontWeight: 600,
});

export const formCard = style({
  background: 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${vars.color.bgCardBorder}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  width: '100%',
  maxWidth: '360px',
  textAlign: 'left',
});

export const fieldLabel = style({
  fontSize: '11px',
  color: vars.color.accentPrimary,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: vars.space.xs,
  display: 'block',
});

export const fieldOptional = style({
  color: vars.color.textMuted,
});

export const fieldInput = style({
  width: '100%',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: vars.radius.sm,
  padding: '10px 12px',
  color: vars.color.textPrimary,
  fontSize: '14px',
  marginBottom: vars.space.md,
  outline: 'none',
  transition: 'border-color 0.2s',
  ':focus': {
    borderColor: vars.color.accentPrimary,
  },
});

export const fieldError = style({
  fontSize: '11px',
  color: '#f87171',
  marginTop: `-${vars.space.sm}`,
  marginBottom: vars.space.sm,
});

export const submitButton = style({
  width: '100%',
  background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
  borderRadius: vars.radius.md,
  padding: '14px',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: vars.space.sm,
  transition: 'opacity 0.2s',
  ':hover': {
    opacity: 0.9,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const secureNote = style({
  fontSize: '11px',
  color: vars.color.textMuted,
  marginTop: vars.space.md,
  textAlign: 'center',
});

export const elementIcons = style({
  fontSize: '32px',
  marginBottom: vars.space.sm,
  display: 'flex',
  gap: vars.space.sm,
  justifyContent: 'center',
});
```

- [ ] **Step 2: Create component**

Create `src/components/InputForm/InputForm.tsx`:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import { fadeUp } from '@/styles/animations';
import * as s from './InputForm.css';

const schema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  birthDate: z.string().min(1, 'Please enter your birth date'),
  birthTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function InputForm() {
  const { setInput, fetchSaju, isLoading } = useSajuStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setInput(data.name, data.birthDate, data.birthTime || null);
    await fetchSaju();
  };

  return (
    <motion.section
      className={s.wrapper}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div className={s.elementIcons}>
        <span>🌲</span>
        <span>🔥</span>
        <span>⛰️</span>
        <span>🪙</span>
        <span>🌊</span>
      </div>

      <h1 className={s.logo}>K-SAJU</h1>
      <p className={s.tagline}>Four Pillars of Destiny</p>

      <p className={s.subtitle}>
        Discover your cosmic blueprint through{' '}
        <span className={s.accentText}>ancient Korean astrology</span>
      </p>

      <form className={s.formCard} onSubmit={handleSubmit(onSubmit)}>
        <label className={s.fieldLabel}>Your Name</label>
        <input
          className={s.fieldInput}
          placeholder="Enter your name"
          {...register('name')}
        />
        {errors.name && <p className={s.fieldError}>{errors.name.message}</p>}

        <label className={s.fieldLabel}>Date of Birth</label>
        <input
          type="date"
          className={s.fieldInput}
          {...register('birthDate')}
        />
        {errors.birthDate && <p className={s.fieldError}>{errors.birthDate.message}</p>}

        <label className={s.fieldLabel}>
          Time of Birth <span className={s.fieldOptional}>(optional)</span>
        </label>
        <input
          type="time"
          className={s.fieldInput}
          {...register('birthTime')}
        />

        <button type="submit" className={s.submitButton} disabled={isLoading}>
          {isLoading ? 'Reading the stars...' : 'Reveal My Destiny'}
        </button>
      </form>

      <p className={s.secureNote}>🔒 Your data is never stored or shared</p>
    </motion.section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/InputForm/
git commit -m "feat: add InputForm component with react-hook-form and zod validation"
```

---

## Task 9: Particles Component

**Files:**
- Create: `src/components/Particles/Particles.tsx`, `src/components/Particles/Particles.css.ts`

- [ ] **Step 1: Create styles**

Create `src/components/Particles/Particles.css.ts`:

```typescript
import { style, keyframes } from '@vanilla-extract/css';

const float = keyframes({
  '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
  '10%': { opacity: 0.7 },
  '90%': { opacity: 0.7 },
  '100%': { transform: 'translateY(-80px) rotate(180deg)', opacity: 0 },
});

export const container = style({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

export const particle = style({
  position: 'absolute',
  fontSize: '12px',
  opacity: 0,
  animation: `${float} linear infinite`,
});
```

- [ ] **Step 2: Create component**

Create `src/components/Particles/Particles.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as s from './Particles.css';

const EMOJIS = ['🍃', '💧', '🔥', '✨', '🪨', '🌿', '💎', '🌊', '🌸'];
const MAX_PARTICLES = 20;

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (container.childElementCount >= MAX_PARTICLES) return;

      const el = document.createElement('div');
      el.className = s.particle;
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.animationDuration = `${4 + Math.random() * 4}s`;
      el.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(el);

      setTimeout(() => el.remove(), 8000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className={s.container} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Particles/
git commit -m "feat: add floating particles background component"
```

---

## Task 10: ElementChart (D3.js Pentagon) + ElementNode

**Files:**
- Create: `src/components/ElementChart/ElementChart.tsx`, `src/components/ElementChart/ElementChart.css.ts`, `src/components/ElementNode/ElementNode.tsx`, `src/components/ElementNode/ElementNode.css.ts`

- [ ] **Step 1: Create ElementNode styles**

Create `src/components/ElementNode/ElementNode.css.ts`:

```typescript
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const nodeGroup = style({
  cursor: 'pointer',
});

export const tooltip = style({
  position: 'absolute',
  background: 'rgba(15, 23, 42, 0.95)',
  border: `1px solid ${vars.color.bgCardBorder}`,
  borderRadius: vars.radius.md,
  padding: '14px 16px',
  width: '220px',
  backdropFilter: 'blur(12px)',
  zIndex: 100,
  pointerEvents: 'none',
});

export const tooltipTitle = style({
  fontSize: '14px',
  fontWeight: 700,
  marginBottom: vars.space.xs,
});

export const tooltipDesc = style({
  fontSize: '11px',
  color: vars.color.textSecondary,
  lineHeight: '1.5',
});

export const traitTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  marginTop: vars.space.sm,
});

export const traitTag = style({
  fontSize: '10px',
  padding: '2px 8px',
  borderRadius: vars.radius.full,
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#cbd5e1',
});
```

- [ ] **Step 2: Create ElementNode component**

Create `src/components/ElementNode/ElementNode.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Element } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';
import * as s from './ElementNode.css';

interface ElementNodeProps {
  element: Element;
  percentage: number;
  cx: number;
  cy: number;
  isDominant: boolean;
}

const ELEMENT_BG: Record<Element, [string, string]> = {
  wood:  ['#4ade80', '#166534'],
  fire:  ['#f87171', '#991b1b'],
  earth: ['#c9a44a', '#6b4f1d'],
  metal: ['#ffd700', '#a37e00'],
  water: ['#60a5fa', '#1e3a5f'],
};

export function ElementNode({ element, percentage, cx, cy, isDominant }: ElementNodeProps) {
  const [hovered, setHovered] = useState(false);
  const meta = ELEMENT_META[element];
  const [lightColor, darkColor] = ELEMENT_BG[element];
  const nodeId = `node-${element}`;

  return (
    <g
      className={s.nodeGroup}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow effect */}
      <defs>
        <radialGradient id={`glow-${element}`}>
          <stop offset="0%" stopColor={meta.color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`bg-${element}`} cx="40%" cy="40%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={darkColor} />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx={cx} cy={cy} r={hovered ? 75 : 65} fill={`url(#glow-${element})`} opacity={hovered ? 1 : 0.5} />

      {/* Main circle */}
      <circle cx={cx} cy={cy} r={50} fill={`url(#bg-${element})`} stroke={meta.color} strokeWidth={2} />

      {/* Emoji */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="28" dominantBaseline="central">
        {meta.emoji}
      </text>

      {/* Label */}
      <text x={cx} y={cy + 24} textAnchor="middle" fill="white" fontSize="11" fontWeight="700" letterSpacing="1.5">
        {meta.label.toUpperCase()}
      </text>

      {/* Percentage bar background */}
      <rect x={cx - 30} y={cy + 36} width={60} height={5} rx={2.5} fill="rgba(255,255,255,0.15)" />
      {/* Percentage bar fill */}
      <rect x={cx - 30} y={cy + 36} width={60 * (percentage / 100)} height={5} rx={2.5} fill={meta.color} />
      {/* Percentage text */}
      <text x={cx} y={cy + 52} textAnchor="middle" fill={meta.color} fontSize="10" fontWeight="700">
        {percentage}%
      </text>

      {/* Dominant badge */}
      {isDominant && (
        <>
          <rect x={cx + 20} y={cy - 52} width={70} height={18} rx={9} fill="linear-gradient(135deg, #fbbf24, #f59e0b)" />
          <rect x={cx + 20} y={cy - 52} width={70} height={18} rx={9} fill="#fbbf24" />
          <text x={cx + 55} y={cy - 40} textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="800" letterSpacing="0.5">
            DOMINANT
          </text>
        </>
      )}

      {/* Tooltip on hover - rendered as foreignObject for HTML content */}
      {hovered && (
        <foreignObject x={cx - 110} y={cy + 60} width={220} height={140}>
          <div className={s.tooltip}>
            <div className={s.tooltipTitle} style={{ color: meta.color }}>
              {meta.emoji} {meta.label} — {meta.archetype}
            </div>
            <div className={s.tooltipDesc}>
              {percentage}% of your elemental balance
            </div>
            <div className={s.traitTags}>
              {meta.traits.map((t) => (
                <span key={t} className={s.traitTag}>{t}</span>
              ))}
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
```

- [ ] **Step 3: Create ElementChart styles**

Create `src/components/ElementChart/ElementChart.css.ts`:

```typescript
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${vars.space.xxl} ${vars.space.lg}`,
  position: 'relative',
});

export const sectionLabel = style({
  fontSize: '11px',
  letterSpacing: '3px',
  color: vars.color.accentPrimary,
  textTransform: 'uppercase',
  marginBottom: vars.space.xs,
});

export const sectionTitle = style({
  fontSize: '24px',
  fontWeight: 800,
  background: `linear-gradient(90deg, ${vars.color.accentSecondaryStart}, ${vars.color.accentSecondaryEnd})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: vars.space.lg,
});

export const freeBadge = style({
  fontSize: '10px',
  background: vars.color.success,
  color: '#052e16',
  padding: '3px 10px',
  borderRadius: vars.radius.full,
  fontWeight: 700,
  marginBottom: vars.space.sm,
  display: 'inline-block',
});

export const chartSvg = style({
  width: '100%',
  maxWidth: '550px',
});

export const legend = style({
  display: 'flex',
  gap: vars.space.lg,
  marginTop: vars.space.lg,
  fontSize: '12px',
  color: vars.color.textSecondary,
});

export const legendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});
```

- [ ] **Step 4: Create ElementChart component**

Create `src/components/ElementChart/ElementChart.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import type { ElementBalance, Element } from '@/lib/saju/types';
import { ElementNode } from '@/components/ElementNode/ElementNode';
import { fadeUp, staggerContainer } from '@/styles/animations';
import * as s from './ElementChart.css';

interface ElementChartProps {
  balance: ElementBalance;
  dominantElement: Element;
  name: string;
}

// Pentagon positions (center: 275, 250), radius: 160
const POSITIONS: { element: Element; cx: number; cy: number }[] = [
  { element: 'wood',  cx: 275, cy: 70 },   // top
  { element: 'fire',  cx: 440, cy: 190 },  // top-right
  { element: 'earth', cx: 380, cy: 380 },  // bottom-right
  { element: 'metal', cx: 170, cy: 380 },  // bottom-left
  { element: 'water', cx: 110, cy: 190 },  // top-left
];

// Generating cycle (상생): wood→fire→earth→metal→water→wood
const GENERATING: [number, number][] = [[0,1],[1,2],[2,3],[3,4],[4,0]];
// Controlling cycle (상극): wood→earth, earth→water, water→fire, fire→metal, metal→wood
const CONTROLLING: [number, number][] = [[0,2],[2,4],[4,1],[1,3],[3,0]];

function curvedPath(x1: number, y1: number, x2: number, y2: number, offset: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const nx = -dy;
  const ny = dx;
  const len = Math.sqrt(nx * nx + ny * ny);
  const cx = mx + (nx / len) * offset;
  const cy = my + (ny / len) * offset;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export function ElementChart({ balance, dominantElement, name }: ElementChartProps) {
  return (
    <motion.section
      className={s.wrapper}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <motion.span className={s.freeBadge} variants={fadeUp}>FREE</motion.span>
      <motion.p className={s.sectionLabel} variants={fadeUp}>Five Elements Analysis</motion.p>
      <motion.h2 className={s.sectionTitle} variants={fadeUp}>{name}&apos;s Five Elements</motion.h2>

      <motion.svg viewBox="0 0 550 480" className={s.chartSvg} variants={fadeUp}>
        <defs>
          <marker id="arrow-gen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ade80" />
          </marker>
          <marker id="arrow-ctrl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(239,68,68,0.4)" />
          </marker>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Generating cycle arrows (상생) */}
        {GENERATING.map(([from, to]) => {
          const p1 = POSITIONS[from];
          const p2 = POSITIONS[to];
          return (
            <path
              key={`gen-${from}-${to}`}
              d={curvedPath(p1.cx, p1.cy, p2.cx, p2.cy, -25)}
              fill="none"
              stroke="#4ade80"
              strokeWidth={2}
              markerEnd="url(#arrow-gen)"
              opacity={0.7}
              filter="url(#glow-filter)"
            />
          );
        })}

        {/* Controlling cycle arrows (상극) */}
        {CONTROLLING.map(([from, to]) => {
          const p1 = POSITIONS[from];
          const p2 = POSITIONS[to];
          return (
            <line
              key={`ctrl-${from}-${to}`}
              x1={p1.cx} y1={p1.cy}
              x2={p2.cx} y2={p2.cy}
              stroke="rgba(239,68,68,0.3)"
              strokeWidth={1.5}
              strokeDasharray="6,4"
              markerEnd="url(#arrow-ctrl)"
            />
          );
        })}

        {/* Element nodes */}
        {POSITIONS.map(({ element, cx, cy }) => (
          <ElementNode
            key={element}
            element={element}
            percentage={balance[element]}
            cx={cx}
            cy={cy}
            isDominant={element === dominantElement}
          />
        ))}
      </motion.svg>

      <div className={s.legend}>
        <div className={s.legendItem}>
          <svg width="30" height="3"><line x1="0" y1="1.5" x2="30" y2="1.5" stroke="#4ade80" strokeWidth="2" /></svg>
          <span>Generates (상생)</span>
        </div>
        <div className={s.legendItem}>
          <svg width="30" height="3"><line x1="0" y1="1.5" x2="30" y2="1.5" stroke="#f87171" strokeWidth="2" strokeDasharray="4,3" /></svg>
          <span>Controls (상극)</span>
        </div>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ElementChart/ src/components/ElementNode/
git commit -m "feat: add ElementChart pentagon and ElementNode with D3-style SVG"
```

---

## Task 11: ReadingCard + Paywall Components

**Files:**
- Create: `src/components/ReadingCard/ReadingCard.tsx`, `src/components/ReadingCard/ReadingCard.css.ts`, `src/components/Paywall/Paywall.tsx`, `src/components/Paywall/Paywall.css.ts`

- [ ] **Step 1: Create ReadingCard styles**

Create `src/components/ReadingCard/ReadingCard.css.ts`:

```typescript
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  background: vars.color.bgCard,
  border: `1px solid ${vars.color.bgCardBorder}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.lg,
  marginBottom: vars.space.md,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.md,
});

export const icon = style({
  fontSize: '24px',
});

export const title = style({
  fontSize: '18px',
  fontWeight: 700,
  color: vars.color.textPrimary,
});

export const content = style({
  fontSize: '14px',
  color: vars.color.textSecondary,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
});

export const insightBox = style({
  marginTop: vars.space.md,
  padding: vars.space.md,
  background: 'rgba(129, 140, 248, 0.08)',
  border: `1px solid rgba(129, 140, 248, 0.2)`,
  borderRadius: vars.radius.md,
});

export const insightLabel = style({
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: vars.color.accentPrimary,
  marginBottom: vars.space.xs,
});

export const insightText = style({
  fontSize: '14px',
  color: vars.color.textPrimary,
  fontWeight: 600,
  lineHeight: 1.5,
});
```

- [ ] **Step 2: Create ReadingCard component**

Create `src/components/ReadingCard/ReadingCard.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import type { ReadingSection } from '@/lib/saju/types';
import { slideUp } from '@/styles/animations';
import * as s from './ReadingCard.css';

interface ReadingCardProps {
  reading: ReadingSection;
  index: number;
}

export function ReadingCard({ reading, index }: ReadingCardProps) {
  return (
    <motion.div
      className={s.card}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
    >
      <div className={s.header}>
        <span className={s.icon}>{reading.icon}</span>
        <h3 className={s.title}>{reading.title}</h3>
      </div>
      <div className={s.content}>{reading.content}</div>
      <div className={s.insightBox}>
        <div className={s.insightLabel}>Key Insight</div>
        <div className={s.insightText}>{reading.keyInsight}</div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create Paywall styles**

Create `src/components/Paywall/Paywall.css.ts`:

```typescript
import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const wrapper = style({
  position: 'relative',
  padding: `0 ${vars.space.lg}`,
  maxWidth: '640px',
  margin: '0 auto',
});

export const blurOverlay = style({
  filter: 'blur(5px)',
  opacity: 0.4,
  pointerEvents: 'none',
  userSelect: 'none',
});

export const previewCard = style({
  background: vars.color.bgCard,
  border: `1px solid ${vars.color.bgCardBorder}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.sm} ${vars.space.md}`,
  marginBottom: vars.space.sm,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: '13px',
  color: vars.color.textMuted,
});

export const unlockSection = style({
  textAlign: 'center',
  padding: `${vars.space.xl} ${vars.space.lg}`,
  background: 'linear-gradient(180deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))',
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.bgCardBorder}`,
  marginTop: vars.space.lg,
});

export const unlockTitle = style({
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: vars.space.md,
  color: vars.color.textPrimary,
});

export const unlockButton = style({
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  borderRadius: vars.radius.md,
  padding: '14px 32px',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'opacity 0.2s, transform 0.2s',
  ':hover': {
    opacity: 0.9,
    transform: 'scale(1.02)',
  },
});

export const unlockSubtext = style({
  fontSize: '12px',
  color: vars.color.textMuted,
  marginTop: vars.space.sm,
});

export const unlockedWrapper = style({
  padding: `${vars.space.xxl} ${vars.space.lg}`,
  maxWidth: '640px',
  margin: '0 auto',
});

export const readingsTitle = style({
  textAlign: 'center',
  fontSize: '11px',
  letterSpacing: '3px',
  color: vars.color.accentPink,
  textTransform: 'uppercase',
  marginBottom: vars.space.xs,
});

export const readingsHeading = style({
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 800,
  background: `linear-gradient(90deg, #f472b6, ${vars.color.accentSecondaryStart})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: vars.space.xl,
});
```

- [ ] **Step 4: Create Paywall component**

Create `src/components/Paywall/Paywall.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { useSajuStore } from '@/lib/store';
import type { SajuReadings } from '@/lib/saju/types';
import { ReadingCard } from '@/components/ReadingCard/ReadingCard';
import { fadeUp, blurReveal } from '@/styles/animations';
import * as s from './Paywall.css';

const PREVIEW_ITEMS = [
  { icon: '📜', label: 'Life Fortune (Early ~ Late Years)' },
  { icon: '🐍', label: '2026 New Year Fortune' },
  { icon: '💼', label: 'Career Reading' },
  { icon: '💕', label: 'Love Reading' },
  { icon: '🏥', label: 'Health Reading' },
  { icon: '💰', label: 'Wealth Reading' },
];

interface PaywallProps {
  readings: SajuReadings | null;
}

export function Paywall({ readings }: PaywallProps) {
  const { isPaid, unlockReadings } = useSajuStore();

  if (isPaid && readings) {
    const readingList = [
      readings.lifeFortune,
      readings.yearFortune,
      readings.career,
      readings.love,
      readings.health,
      readings.wealth,
    ];

    return (
      <motion.section
        className={s.unlockedWrapper}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p className={s.readingsTitle}>Full Reading</p>
        <h2 className={s.readingsHeading}>Your Complete Destiny</h2>
        {readingList.map((reading, i) => (
          <ReadingCard key={reading.title} reading={reading} index={i} />
        ))}
      </motion.section>
    );
  }

  return (
    <section className={s.wrapper}>
      <div className={s.blurOverlay}>
        {PREVIEW_ITEMS.map((item) => (
          <div key={item.label} className={s.previewCard}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <motion.div
        className={s.unlockSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3 className={s.unlockTitle}>🔓 Unlock Your Full Reading</h3>
        <button className={s.unlockButton} onClick={unlockReadings}>
          Get Complete Destiny — $0.99
        </button>
        <p className={s.unlockSubtext}>One-time payment, instant access</p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ReadingCard/ src/components/Paywall/
git commit -m "feat: add ReadingCard and Paywall components with blur unlock UX"
```

---

## Task 12: Assemble Main Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wire up the main page**

Replace `src/app/page.tsx`:

```tsx
'use client';

import { useSajuStore } from '@/lib/store';
import { InputForm } from '@/components/InputForm/InputForm';
import { ElementChart } from '@/components/ElementChart/ElementChart';
import { Paywall } from '@/components/Paywall/Paywall';
import { Particles } from '@/components/Particles/Particles';

export default function Home() {
  const { result, readings, name } = useSajuStore();

  return (
    <main>
      <Particles />

      {!result ? (
        <InputForm />
      ) : (
        <>
          <ElementChart
            balance={result.elementBalance}
            dominantElement={result.dominantElement}
            name={name || 'You'}
          />
          <Paywall readings={readings} />
        </>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Verify the app runs end-to-end**

```bash
cd /Users/solbi/k-saju && npm run dev
```

Open `http://localhost:3000`:
1. Fill in name, birth date, optional time
2. Click "Reveal My Destiny"
3. Should see the five elements pentagon chart
4. Below it, blurred paywall with unlock button
5. Click unlock → readings appear (if Gemini API key is set)

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble main page with input → elements → paywall flow"
```

---

## Task 13: Final Polish and Build Verification

**Files:**
- Modify: various (fix any build issues)

- [ ] **Step 1: Run type check**

```bash
cd /Users/solbi/k-saju && npx tsc --noEmit
```

Fix any type errors found.

- [ ] **Step 2: Run tests**

```bash
cd /Users/solbi/k-saju && npm test
```

All saju calculator tests should pass.

- [ ] **Step 3: Run production build**

```bash
cd /Users/solbi/k-saju && npm run build
```

Should build successfully with no errors.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build and type errors"
```

- [ ] **Step 5: Add .gitignore entries**

Ensure `.gitignore` includes:

```
.env.local
.superpowers/
```

```bash
git add .gitignore
git commit -m "chore: update gitignore"
```
