import { style, keyframes } from '@vanilla-extract/css';

const twinkle = keyframes({
  '0%, 100%': { opacity: 0 },
  '50%': { opacity: 1 },
});

export const container = style({
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
});

export const star = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  borderRadius: '50%',
  animation: `${twinkle} ease-in-out infinite`,
});
