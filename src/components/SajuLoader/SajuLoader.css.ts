import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const spinReverse = keyframes({
  from: { transform: 'rotate(360deg)' },
  to: { transform: 'rotate(0deg)' },
});

const breathe = keyframes({
  '0%, 100%': { opacity: 0.45 },
  '50%': { opacity: 0.85 },
});

export const wrap = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${vars.space.xl} 0`,
});

export const sealWrap = style({
  position: 'relative',
  width: '140px',
  height: '140px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const ring = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

export const ringOuter = style({
  animation: `${spin} 6s linear infinite`,
  transformOrigin: 'center',
  transformBox: 'fill-box',
});

export const ringInner = style({
  animation: `${spinReverse} 9s linear infinite`,
  transformOrigin: 'center',
  transformBox: 'fill-box',
});

export const ringPulse = style({
  animation: `${breathe} 2.5s ease-in-out infinite`,
});

export const seal = style({
  fontFamily: vars.font.hanja,
  fontSize: '60px',
  fontWeight: 900,
  color: vars.color.goldPrimary,
  display: 'block',
  lineHeight: 1,
  position: 'relative',
  zIndex: 1,
  textShadow: '0 0 24px rgba(232, 185, 74, 0.4)',
});

export const label = style({
  marginTop: vars.space.xl,
  position: 'relative',
  width: '100%',
  height: '54px',
});

export const labelInner = style({
  position: 'absolute',
  left: '50%',
  top: 0,
  transform: 'translateX(-50%)',
  width: '100%',
  textAlign: 'center',
});

export const labelText = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  margin: 0,
});

export const labelSub = style({
  fontFamily: vars.font.hanja,
  fontSize: '18px',
  fontWeight: 700,
  color: vars.color.creamSoft,
  margin: `${vars.space.xxs} 0 0`,
  letterSpacing: '4px',
});
