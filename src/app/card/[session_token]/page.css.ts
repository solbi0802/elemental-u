import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const page = style({
  minHeight: '100vh',
  background: vars.color.canvas,
  position: 'relative',
  zIndex: 1,
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  padding: `${vars.space.lg} ${vars.space.xl}`,
});

export const brandLink = style({
  fontFamily: vars.font.mono,
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  textDecoration: 'none',
  ':hover': {
    color: vars.color.creamText,
  },
});

export const cardSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: `${vars.space.xl} ${vars.space.lg} ${vars.space.section}`,
  textAlign: 'center',
});

export const eyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  margin: `0 0 ${vars.space.sm}`,
});

export const subtitle = style({
  fontFamily: vars.font.serif,
  fontSize: '40px',
  fontWeight: 500,
  letterSpacing: '-1px',
  color: vars.color.creamText,
  margin: `0 0 ${vars.space.md}`,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '28px',
    },
  },
});

/* The SajuCard is built at native 1080×1080 — for browser preview we wrap
   it in a fixed-size frame and scale the inner card down with transform.
   The frame dimensions track the scale factor so layout reserves the
   correct space and surrounding content sits where it should. */
const PREVIEW_SIZE = 540;
const SCALE = PREVIEW_SIZE / 1080;

export const cardFrame = style({
  position: 'relative',
  width: `${PREVIEW_SIZE}px`,
  height: `${PREVIEW_SIZE}px`,
  overflow: 'hidden',
  margin: `${vars.space.xl} 0`,
  borderRadius: vars.radius.lg,
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 168, 87, 0.18)',
  '@media': {
    'screen and (max-width: 600px)': {
      width: 'min(90vw, 540px)',
      height: 'min(90vw, 540px)',
    },
  },
});

export const cardScale = style({
  width: '1080px',
  height: '1080px',
  transform: `scale(${SCALE})`,
  transformOrigin: 'top left',
  '@media': {
    'screen and (max-width: 600px)': {
      transform: 'scale(calc(min(90vw, 540px) / 1080))',
    },
  },
});
