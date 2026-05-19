## Overview

Elemental-U is a Korean Four Pillars (`四柱命理`) destiny reading service. The base atmosphere is a **deep jade canvas** (`{colors.canvas}` — #0d3d36) holding **gold Korean traditional patterns** as the dominant brand element. Where most fortune-telling sites lean into mystical purple gradients or generic mystic-tech aesthetics, Elemental-U leans hard into Korean heritage — `壽福囍` seal motifs, octagonal flower lattices, and gold serif Hanja as the primary visual voltage.

Type voice runs **Cormorant Garamond** at weight 500 for display headlines (large display sizes with -1 to -2px letter-spacing) and **Inter** at standard weights for body, UI, and navigation. Hanja decorations (`壽`, `福`, `囍`, `命`, `木火土金水`) sit in **Noto Serif KR** at weight 700–900 — the heavier weight gives the seal-stamp impression that mirrors traditional Korean carved seals.

Component voltage comes from **gold linework on deep jade** — corner brackets at card edges, double-ring seal stamps with single Hanja centered, and `{component.pattern-strip}` (a 7-up horizontal band of 大-scale Hanja seals) anchoring section transitions. The cards do NOT use saturated color fills; instead they vary across three jade tones (`{colors.canvas-soft}`, `{colors.canvas-deep}`, `{colors.canvas-elevated}`) with gold borders providing the rhythm.

**Key Characteristics:**

- Deep jade canvas (`{colors.canvas}` — #0d3d36). The dark green differentiates Elemental-U from cool-purple competitor sites and roots the brand in Korean ceremonial color tradition.
- Gold primary CTAs (`{colors.gold-primary}` — #e8b94a) with deep-jade text. Buttons rounded `{rounded.sm}` (6px) — slightly more angular than typical SaaS to evoke ink-stamped seals.
- Three jade surface tones (`{colors.canvas-soft}`, `{colors.canvas-deep}`, `{colors.canvas-elevated}`) provide depth without shadows.
- Corner-bracket ornament (`L`-shaped gold brackets at card corners) is the signature visual treatment for primary surfaces.
- `{component.pattern-strip}` — a horizontal band of 7 prominent Hanja seals — anchors the brand identity at hero-bottom and pre-paywall positions.
- Cormorant Garamond display headlines at weight 500 with -1 to -2px letter-spacing; italic for accent words.
- Border radius is tight: `{rounded.sm}` (6px) buttons + inputs, `{rounded.md}` (10px) standard cards, `{rounded.lg}` (14px) reading cards, `{rounded.xl}` (20px) major feature blocks. Tighter than Clay-style; matches the carved-seal aesthetic.
- All Hanja characters (`壽福囍`, `木火土金水`, `四柱`, `丙午`, `相生`/`相剋`) are kept as decorative cultural symbols even in the English-only UI.
- Section rhythm `{spacing.section}` (96px) between major bands.

## Colors

### Canvas (Deep Jade)

- **Canvas** (`{colors.canvas}` — #0d3d36): The default page floor. Deep jade green.
- **Canvas Soft** (`{colors.canvas-soft}` — #0a2a25): Inner panel surface for primary cards and content containers.
- **Canvas Elevated** (`{colors.canvas-elevated}` — #124a42): Hover, emphasized blocks, the CTA band.
- **Canvas Deep** (`{colors.canvas-deep}` — #06201c): Deepest fill, used for input fields and tooltip backgrounds where text needs maximum contrast.

### Gold (Brand Accent)

- **Gold Primary** (`{colors.gold-primary}` — #e8b94a): Primary CTAs, accent headlines, Hanja seal fills, focused input borders. The flagship brand color.
- **Gold Line** (`{colors.gold-line}` — #d4a857): Borders, seal outlines, divider strokes, 1.5px feature card borders.
- **Gold Soft** (`{colors.gold-soft}` — #b89a4a): Secondary accents.
- **Gold Muted** (`{colors.gold-muted}` — #8a7d5c): Captions, fine-print, inactive labels.

### Cream (Text on Jade)

- **Cream Text** (`{colors.cream-text}` — #f5e6c8): Headlines and primary body text on jade canvas.
- **Cream Soft** (`{colors.cream-soft}` — #c9b896): Secondary body, descriptions, sub-headings.
- **Cream Muted** (`{colors.cream-muted}` — #8f8470): Fine captions on jade.

### Borders

- **Hairline** (`{colors.hairline}` — rgba(212, 168, 87, 0.18)): Subtle 1px gold-tinted borders on standard cards.
- **Hairline Strong** (`{colors.hairline-strong}` — rgba(212, 168, 87, 0.42)): Emphasized 1px borders on featured cards and bracket frames.

### On-Color

- **On Gold** (`{colors.on-gold}` — #0d3d36): Jade text used on gold CTA buttons.

### Five Elements (오방색 for Jade Canvas)

- **Wood** (`{colors.wood}` — #3aa15c)
- **Fire** (`{colors.fire}` — #f15b46)
- **Earth** (`{colors.earth}` — #f0c860)
- **Metal** (`{colors.metal}` — #c8c8e0)
- **Water** (`{colors.water}` — #5a9ce8)

Saturation tuned higher than a cream-canvas version — these need to read clearly against the dark jade backdrop.

### Semantic

- **Success** (`{colors.success}` — #3aa15c): Reuses wood green.
- **Error** (`{colors.error}` — #f15b46): Reuses fire red. Saju semantic chrome aligns with elemental color in this system.

## Typography

### Font Stacks

The system runs four font stacks:

- `{font.serif}` — **Cormorant Garamond** for display headlines. Loaded via `next/font/google` as `--font-serif`.
- `{font.sans}` — **Inter** for body, UI, and navigation. `--font-sans`.
- `{font.hanja}` — **Noto Serif KR** for Hanja characters and Korean seal-style display. `--font-hanja`. Has full CJK glyph coverage (Cormorant does not).
- `{font.mono}` — **JetBrains Mono** for eyebrows, labels, badges, and captions. `--font-mono`.

### Hierarchy

| Token                            | Family      | Size | Weight | Line Height | Letter Spacing | Use                                                     |
| -------------------------------- | ----------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------------- |
| `{typography.display-xl}`        | serif       | 72px | 500    | 1.0         | -2px           | Hero h1 — Cormorant Garamond                            |
| `{typography.display-lg}`        | serif       | 56px | 500    | 1.05        | -1.5px         | Major section heads                                     |
| `{typography.display-md}`        | serif       | 44px | 500    | 1.1         | -1px           | ElementChart title, Paywall heads                       |
| `{typography.display-sm}`        | serif       | 36px | 500    | 1.15        | -0.5px         | CTA-band heads                                          |
| `{typography.title-lg}`          | serif       | 28px | 600    | 1.2         | -0.5px         | ReadingCard titles                                      |
| `{typography.title-md}`          | sans        | 18px | 600    | 1.4         | 0              | Card titles, intro paragraphs                           |
| `{typography.title-sm}`          | sans        | 16px | 600    | 1.4         | 0              | Small card titles, list labels                          |
| `{typography.body-md}`           | sans        | 15px | 400    | 1.7         | 0              | Default reading text                                    |
| `{typography.body-sm}`           | sans        | 13px | 400    | 1.6         | 0              | Footer body, fine-print                                 |
| `{typography.caption}`           | mono        | 12px | 600    | 1.4         | 2–3px          | Section labels, eyebrows ("FOUR PILLARS · 四柱")        |
| `{typography.caption-sm}`        | mono        | 10px | 600    | 1.4         | 2px            | Sub-labels, pillar titles                               |
| `{typography.button}`            | sans        | 13px | 700    | 1.0         | 2–3px          | Standard button labels, uppercase                       |
| `{typography.hanja-seal-lg}`     | hanja       | 38px | 900    | 1.0         | 0              | Pattern-strip Hanja inside seal frames (壽福囍)         |
| `{typography.hanja-seal-md}`     | hanja       | 22px | 900    | 1.0         | 0              | Small inline seals (`<HanjaSeal>` component)            |
| `{typography.hanja-pillar}`      | hanja       | 26px | 700    | 1.1         | 0              | Four-pillar stem characters in ElementChart            |

### Principles

Cormorant Garamond at weight 500 with negative letter-spacing IS the brand voice. The italic variant on accent words (e.g., the `<headingAccent>` span) gives the editorial-mystic tone — going to weight 700 reads as bombastic; the slender serif gives gravitas without weight.

The serif-vs-sans split is functional: Cormorant for headlines (Cormorant only — no Hanja glyph coverage), Inter for everything operational (running text, UI, buttons), Noto Serif KR for Hanja and Korean characters specifically. Mixing them is a system violation.

### Note on Font Substitutes

Cormorant Garamond fallbacks to system serif if not loaded. Noto Serif KR `preload: false` since not every page renders Hanja — async load is acceptable. The fallback CJK font (`"Times New Roman", serif`) will render Hanja with correct glyphs on macOS/Linux but with poorer aesthetic; visual seal-stamp effect requires Noto Serif KR.

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) between major editorial bands.
- **Card internal padding:** `{spacing.xl}` (32px) for primary feature cards; `{spacing.lg}` (24px) for reading and locked cards.

### Grid & Container

- **Max content width:** ~1280px centered for ElementChart; ~720px for InputForm and Paywall.
- **Pattern strip:** Full-width within 1100px container, 7-column grid (4-column on mobile).
- **Reading cards:** Single-column stack (centered max 720px).
- **Locked card grid:** 2-up at desktop, 1-up at mobile (<520px).

### Whitespace Philosophy

Elemental-U uses generous whitespace around display headlines and the pattern strip. The jade canvas + gold patterns + double-ring seals create a ceremonial weight that competing fortune-telling sites lack.

## Elevation & Depth

| Level              | Treatment                                              | Use                                |
| ------------------ | ------------------------------------------------------ | ---------------------------------- |
| Flat               | No shadow, no border                                   | Body sections, main canvas         |
| Hairline           | 1px `{colors.hairline}` border on canvas-soft fill     | Standard reading cards             |
| Gold-line          | 1.5px `{colors.gold-line}` border + corner brackets    | InputForm, CTA band, ElementChart  |
| Tonal stack        | `canvas-deep` panel inside `canvas-soft` card          | Pillar cards, input fields         |
| Featured           | `canvas-deep` fill + full `{colors.gold-line}` border  | The middle ReadingCard variant     |
| Deep tooltip       | `canvas-deep` + heavy shadow (0 8px 24px rgba(0,0,0,.4)) | Hover tooltips above SVG chart   |

Depth is expressed through **jade tonal contrast** (canvas / canvas-soft / canvas-deep / canvas-elevated) and **gold linework**, NOT through drop shadows. The corner-bracket ornament adds perceived elevation to primary surfaces without any shadow.

### Decorative Depth

- **`{component.pattern-strip}`** — a 7-up horizontal grid of large Hanja seals (壽福囍 + octagonal flower + 8-petal flower + geometric octagon + lotus). Appears once per page between sections. The brand's most-recognized depth element. Not a token — it's a composite component.
- **Background floating motifs** — `{component.korean-patterns}` renders 10+ small motifs (stepped clouds, mountain arcs, round clouds, flower lattices) fixed across the viewport at opacity 0.2–0.32. Forms an ambient gold-on-jade texture without competing with content.

## Shapes

### Border Radius Scale

| Token            | Value        | Use                                             |
| ---------------- | ------------ | ----------------------------------------------- |
| `{rounded.xs}`   | 4px          | Small badges, ornament corners                  |
| `{rounded.sm}`   | 6px          | Standard CTA buttons, text inputs, insight box  |
| `{rounded.md}`   | 10px         | Pillar cards, locked cards, master card         |
| `{rounded.lg}`   | 14px         | Reading cards                                   |
| `{rounded.xl}`   | 20px         | ElementChart container, CTA band                |
| `{rounded.pill}` | 9999px       | Eyebrow chips, trait badges                     |

### Corner Bracket Ornament

The signature visual ornament: `L`-shaped 2px gold lines at the top-left and bottom-right of feature cards (InputForm `formCard`, ElementChart `colorBlock`, Paywall `ctaBlock`). Implemented via `::before`/`::after` pseudo-elements. Implies traditional Korean carved frames around significant text.

## Components

### Buttons

**`button-primary`** — Background `{colors.gold-primary}`, text `{colors.on-gold}` (jade), type `{typography.button}` (Inter 13px / 700 / uppercase / 2px tracked), rounded `{rounded.sm}` (6px), padding 14px × 32px, height 48px. Hover: background flips to `{colors.cream-text}` (soft cream-yellow). Used in InputForm submit and Paywall CTA.

**`button-secondary`** — (Not currently used in V1; reserve for future.) Jade fill with `{colors.gold-line}` 1px border, `{colors.cream-text}` text.

### Cards & Containers

**`input-form-card`** — InputForm body. Background `{colors.canvas-soft}`, 1.5px `{colors.gold-line}` border, rounded `{rounded.lg}` (14px), padding `{spacing.xl}` (32px), corner-bracket ornament at top-left + bottom-right.

**`element-chart-block`** — ElementChart container. Background `{colors.canvas-soft}`, 1px `{colors.hairline}` border, rounded `{rounded.xl}` (20px), padding `{spacing.xxl}` (48px), corner-bracket ornament. Holds the pentagonal element chart, master card, legend, and four-pillar row.

**`master-card`** — Day Master pill. Background `{colors.canvas-elevated}`, 1px `{colors.gold-line}` border, rounded `{rounded.md}` (10px), padding 10px × 20px.

**`pillar-card`** — One of four pillar cards (Year / Month / Day / Hour). Background `{colors.canvas-deep}`, 1px `{colors.hairline}` border, rounded `{rounded.md}`, padding 16px × 20px. Hover: border becomes `{colors.gold-line}`.

**`reading-card-a`** / **`reading-card-b`** / **`reading-card-c`** — Three jade variants that rotate across six readings (A-B-C-A-B-C). All carry the same structure: large Hanja seal at top-right rotated -6°, mono eyebrow, serif title, body text, gold-tinted insight box at bottom.
  - **A**: `{colors.canvas-soft}` + `{colors.hairline-strong}` border. Seal: 壽.
  - **B (featured)**: `{colors.canvas-deep}` + 1.5px `{colors.gold-line}` border. Seal: 福.
  - **C**: `{colors.canvas-elevated}` + `{colors.hairline}` border. Seal: 囍.

  Each reading also carries a topic-specific seal that overrides the variant default (命 / 運 / 業 / 緣 / 康 / 財).

**`locked-card`** — Paywall locked-reading row. Background `{colors.canvas-soft}`, 1px `{colors.hairline}` border, rounded `{rounded.md}`, `filter: blur(0.6px)` + `opacity: 0.7` to signal locked state. Hover relaxes blur slightly.

**`cta-band`** — Paywall purchase block. Background `{colors.canvas-elevated}`, 1.5px `{colors.gold-line}` border, rounded `{rounded.xl}` (20px), padding `{spacing.xxl}` (48px), full corner-bracket ornament. The most ornate single surface in the system.

### Inputs & Forms

**`text-input`** — Background `{colors.canvas-deep}`, text `{colors.cream-text}`, 1px `{colors.hairline}` border, rounded `{rounded.sm}` (6px), padding 12px × 14px, height 44px. Focus: border flips to `{colors.gold-primary}`. Date and time picker indicators are color-inverted to gold via CSS filter.

### Hanja Seal

**`hanja-seal`** — Reusable inline seal component (`<HanjaSeal char="命" size={56} />`). SVG with double concentric ring (outer 1.5px, inner 0.8px) in `{colors.gold-line}` and a centered Hanja in `{colors.gold-primary}` Noto Serif KR weight 900. Used inside ReadingCard top-right and as the brand-mark element in nav (when nav exists).

### Pattern Strip

**`pattern-strip`** — Horizontal band of 7 Hanja seals across full content width. Grid `repeat(7, 1fr)` desktop, `repeat(4, 1fr)` mobile (hides 5–7). Each cell renders one prominent motif at 100% scale: LongevitySeal (壽) → OctagonalFlower → FortuneSeal (福) → EightPetalFlower → DoubleHappinessSeal (囍) → GeometricOctagon → LotusCircle. This is the signature decorative band — appears once on the landing page after InputForm and once after ElementChart.

### Background Pattern Layer

**`korean-patterns`** — Fixed-position layer at `z-index: 0` rendering 10+ floating motifs (stepped clouds, curly clouds, mountain arcs, round clouds, flower lattices) scattered across the viewport. Opacity 0.20–0.32 per motif. Slow `floatSlow` / `floatReverse` / `breathe` animations on a 10–22s loop. Provides ambient texture without distracting from content.

### Wave Divider

**`wave-divider`** — Horizontal SVG of repeating arched scallops in `{colors.gold-line}`. Opacity 0.6. Used between ElementChart and PatternStrip on the results page.

## Do's and Don'ts

### Do

- Anchor every page on the deep jade canvas (`{colors.canvas}` — #0d3d36). The dark green is non-negotiable — it differentiates Elemental-U from purple-mystic competitors.
- Keep Hanja decorations (`壽福囍`, `木火土金水`, `四柱`, `丙午`, `相生`/`相剋`) visible even in English-only UI. They are cultural symbols and design voltage, not translatable strings.
- Use the pattern strip once per page. Two patterns strips compete; one anchors the brand.
- Cycle reading cards through A → B → C → A → B → C. Repeating the same variant twice in a row reads as flat.
- Use Cormorant Garamond italic on accent words (e.g., the `<headingAccent>` span). The italic gives the editorial-mystic flair.
- Reserve `{colors.gold-primary}` for CTAs, accent headlines, and Hanja seal fills. If every element is gold, the accent loses meaning.
- Use corner-bracket ornament on primary feature cards (InputForm, ElementChart, CTA band) — never on secondary cards.

### Don't

- Don't use cream or cool-gray canvas. The deep jade is the brand.
- Don't render Korean patterns below opacity 0.2 in the background layer (they disappear into the jade); don't render them above 0.4 (they fight with text).
- Don't introduce a 7th Hanja seal style. The 7 in the pattern strip are the catalog.
- Don't bold Cormorant beyond weight 600. The slender serif at weight 500 IS the voice.
- Don't render Hanja in Cormorant or Inter — they lack CJK glyph coverage and the result is a fallback render. Always specify `font-hanja`.
- Don't use heavy drop shadows. Depth comes from jade tonal stack and gold linework.
- Don't add a 4th reading-card variant. The three-variant rotation is the system.
- Don't use the corner-bracket ornament as decoration outside of primary feature cards.

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                                                |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| Mobile  | < 768px     | Hero h1 72→44px; pattern strip 7-up → 4-up; pillar row wraps; reading cards padding reduced               |
| Tablet  | 768–1024px  | Pattern strip stays 7-up; ElementChart and Paywall single column                                          |
| Desktop | 1024–1440px | Full pattern strip; ElementChart at 1280px max; reading cards at 720px max                                |
| Wide    | > 1440px    | Same as desktop with more breathing room                                                                  |

### Touch Targets

- `{component.button-primary}` at minimum 48 × 48px.
- `{component.text-input}` height is 44px.

### Collapsing Strategy

- `{component.pattern-strip}` reduces from 7-up to 4-up at mobile, hiding cells 5–7.
- ElementChart pillar row wraps to multi-line if needed.
- Paywall locked-card grid collapses 2 → 1 at <520px.
- Background `{component.korean-patterns}` stays fixed at all breakpoints.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.reading-card-b}`, `{component.cta-band}`).
2. Pick the right reading-card variant for the index: A for even indices outside featured, B for the featured emphasis, C for the muted-jade alternate.
3. Variants of an existing component (`-featured`, `-locked`) live as separate entries.
4. Use `{token.refs}` everywhere — never inline hex.
5. Display headlines stay Cormorant Garamond 500 with negative letter-spacing. Body stays Inter 400. Hanja stays Noto Serif KR 700–900.
6. The jade-throughout palette is a system contract — don't introduce a cream or off-white surface.

## Known Gaps

- The brand currently has no top nav. When added, it should follow `jade nav + gold-line hairline border-bottom + gold brand seal + gold uppercase menu links`.
- Cormorant Garamond does not include CJK glyphs — all Hanja must be wrapped with `font-family: var(--font-hanja)` explicitly. Default body inheritance does NOT cascade correctly through SVG `<text>` elements; specify family inline for SVG.
- Noto Serif KR is loaded with `preload: false` since not every render path uses it. First-paint Hanja may briefly fall back to system serif.
- Pattern-strip seals (壽福囍) are SVG-rendered with inline `text` elements — they require `font-hanja` to render correctly. Verify CJK font load before relying on these visually.
- Animation timings (pattern float, breathe) are in `KoreanPatterns.css.ts` keyframes; if added to design tokens later, extract durations to `{motion.*}` namespace.
- Gemini reading-response language is enforced English-only via system prompt; this is a separate concern from the design system but documented here so future contributors don't try to add a Korean toggle without revisiting the prompt.
- The locked-card `filter: blur(0.6px)` is a soft visual signal; consider adding a stronger lock-state token if A/B testing shows conversion needs sharper differentiation.
