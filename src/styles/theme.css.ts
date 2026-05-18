import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    // Canvas (deep jade)
    canvas: '#0d3d36',
    canvasSoft: '#0a2a25',
    canvasElevated: '#124a42',
    canvasDeep: '#06201c',

    // Gold (brand accent)
    goldPrimary: '#e8b94a',
    goldLine: '#d4a857',
    goldSoft: '#b89a4a',
    goldMuted: '#8a7d5c',

    // Cream text (legible over jade)
    creamText: '#f5e6c8',
    creamSoft: '#c9b896',
    creamMuted: '#8f8470',

    // Borders
    hairline: 'rgba(212, 168, 87, 0.18)',
    hairlineStrong: 'rgba(212, 168, 87, 0.42)',

    // On-color
    onGold: '#0d3d36',

    // Five Elements — tuned for jade canvas (higher saturation than cream version)
    wood: '#3aa15c',
    fire: '#f15b46',
    earth: '#f0c860',
    metal: '#c8c8e0',
    water: '#5a9ce8',

    // Semantic
    success: '#3aa15c',
    error: '#f15b46',
  },
  space: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    section: '96px',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    pill: '9999px',
  },
  font: {
    sans: 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'var(--font-serif), "Noto Serif KR", "Times New Roman", Georgia, serif',
    hanja: 'var(--font-hanja), "Noto Serif KR", "Times New Roman", serif',
    mono: 'var(--font-mono), "SF Mono", "Menlo", monospace',
  },
});
