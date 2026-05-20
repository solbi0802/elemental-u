import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

/* Pentagon Builder loader.
   - Outer guide ring pulses subtly to convey "active".
   - Five element nodes (木火土金水) pop in one by one.
   - Five edges connecting them draw via stroke-dashoffset.
   - Whole pentagon stays visible for the bulk of the cycle, then fades
     and restarts. */

const ringPulse = keyframes({
  '0%, 100%': { opacity: 0.4 },
  '50%': { opacity: 0.75 },
});

const drawEdge = keyframes({
  '0%, 5%': { strokeDashoffset: 200, opacity: 0 },
  '20%': { strokeDashoffset: 0, opacity: 1 },
  '75%': { strokeDashoffset: 0, opacity: 1 },
  '100%': { strokeDashoffset: 0, opacity: 0 },
});

const nodePop = keyframes({
  '0%, 5%': { opacity: 0, transform: 'scale(0.6)' },
  '15%': { opacity: 1, transform: 'scale(1)' },
  '80%': { opacity: 1, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(0.9)' },
});

export const wrap = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.xl} 0`,
});

export const pentagon = style({
  width: '280px',
  height: '280px',
  '@media': {
    'screen and (max-width: 520px)': {
      width: '220px',
      height: '220px',
    },
  },
});

export const guideRing = style({
  fill: 'none',
  stroke: vars.color.goldLine,
  strokeWidth: 1,
  animation: `${ringPulse} 6s ease-in-out infinite`,
});

export const edge = style({
  fill: 'none',
  stroke: vars.color.goldPrimary,
  strokeWidth: 1.6,
  strokeDasharray: 200,
  strokeDashoffset: 200,
  strokeLinecap: 'round',
  animation: `${drawEdge} 7s ease-in-out infinite`,
});

export const node = style({
  fill: vars.color.canvasDeep,
  stroke: vars.color.goldLine,
  strokeWidth: 1.5,
  opacity: 0,
  /* transformBox + transformOrigin so scale animations pivot around each
     node's own center instead of the SVG (0,0) corner. */
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${nodePop} 7s ease-in-out infinite`,
});

export const nodeText = style({
  fill: vars.color.goldPrimary,
  fontSize: '24px',
  fontWeight: 900,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  opacity: 0,
  transformBox: 'fill-box',
  transformOrigin: 'center',
  animation: `${nodePop} 7s ease-in-out infinite`,
});

export const statusRow = style({
  marginTop: vars.space.xl,
  position: 'relative',
  width: '100%',
  height: '54px',
});

export const statusInner = style({
  position: 'absolute',
  left: '50%',
  top: 0,
  transform: 'translateX(-50%)',
  width: '100%',
  textAlign: 'center',
});

export const statusEyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  margin: 0,
});

export const statusSub = style({
  fontFamily: vars.font.hanja,
  fontSize: '18px',
  fontWeight: 700,
  color: vars.color.creamSoft,
  margin: `${vars.space.xxs} 0 0`,
  letterSpacing: '4px',
});
