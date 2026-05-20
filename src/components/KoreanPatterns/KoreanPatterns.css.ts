import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const floatSlow = keyframes({
  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
  '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
});

const floatReverse = keyframes({
  '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
  '50%': { transform: 'translateY(8px) rotate(-1deg)' },
});

const breathe = keyframes({
  '0%, 100%': { opacity: 0.22 },
  '50%': { opacity: 0.32 },
});

export const layer = style({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  /* On narrow viewports the absolutely-positioned motifs (some up to
     280 px wide on a 375 px screen) crowd the content. The fixed-size
     SVGs don't scale down responsively, so hide the floating layer
     entirely on mobile — the in-flow PatternStrip already carries the
     pattern voltage on smaller screens. */
  '@media': {
    'screen and (max-width: 768px)': {
      display: 'none',
    },
  },
});

export const motif = style({
  position: 'absolute',
  animation: `${floatSlow} 22s ease-in-out infinite`,
});

export const motifReverse = style({
  position: 'absolute',
  animation: `${floatReverse} 20s ease-in-out infinite`,
});

export const motifStatic = style({
  position: 'absolute',
  animation: `${breathe} 10s ease-in-out infinite`,
});

export const waveDivider = style({
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',
  display: 'block',
  opacity: 0.6,
});

/* Prominent seal-row band — used between sections for the recognizable "추석 strip" look */
export const stripWrap = style({
  width: '100%',
  maxWidth: '1100px',
  margin: '0 auto',
  padding: `${vars.space.lg} ${vars.space.lg}`,
  position: 'relative',
  zIndex: 1,
});

export const stripRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: vars.space.lg,
  alignItems: 'center',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: vars.space.md,
    },
  },
});

export const stripCell = style({
  width: '100%',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    'screen and (max-width: 768px)': {
      selectors: {
        '&:nth-child(n+5)': { display: 'none' },
      },
    },
  },
});

export const stripCellSvg = style({
  width: '100%',
  height: '100%',
});
