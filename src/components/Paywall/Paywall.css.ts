import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

/* ── locked ── */
export const lockedSection = style({
  padding: `${vars.space.section} ${vars.space.lg}`,
  maxWidth: '720px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
});

export const eyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  textAlign: 'center',
  marginBottom: vars.space.md,
});

export const title = style({
  fontFamily: vars.font.serif,
  fontSize: '44px',
  fontWeight: 500,
  letterSpacing: '-1px',
  lineHeight: 1.1,
  color: vars.color.creamText,
  textAlign: 'center',
  marginBottom: vars.space.xxl,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '30px',
    },
  },
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: vars.space.sm,
  marginBottom: vars.space.xxl,
  '@media': {
    'screen and (max-width: 520px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const lockedCard = style({
  background: vars.color.canvasSoft,
  border: `1px solid ${vars.color.hairline}`,
  borderRadius: vars.radius.md,
  padding: `${vars.space.md} ${vars.space.lg}`,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  filter: 'blur(0.6px)',
  opacity: 0.7,
  transition: 'opacity 0.2s, filter 0.2s',
  position: 'relative',
  ':hover': {
    opacity: 0.85,
    filter: 'blur(0.3px)',
  },
});

export const lockedIcon = style({ fontSize: '20px', flexShrink: 0 });

export const lockedInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const lockedName = style({
  fontSize: '14px',
  fontWeight: 700,
  color: vars.color.creamText,
});

export const lockedDesc = style({
  fontSize: '12px',
  color: vars.color.creamSoft,
});

export const lockBadge = style({
  position: 'absolute',
  top: '8px',
  right: '10px',
  fontSize: '11px',
  opacity: 0.5,
});

/* ── CTA band ── */
export const ctaBlock = style({
  position: 'relative',
  background: vars.color.canvasElevated,
  border: `1.5px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.xl,
  padding: vars.space.xxl,
  textAlign: 'center',
  selectors: {
    /* Corner brackets */
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '28px',
      height: '28px',
      borderColor: vars.color.goldPrimary,
      borderStyle: 'solid',
    },
    '&::before': {
      top: '-3px',
      left: '-3px',
      borderWidth: '2px 0 0 2px',
    },
    '&::after': {
      bottom: '-3px',
      right: '-3px',
      borderWidth: '0 2px 2px 0',
    },
  },
});

export const ctaTitle = style({
  fontFamily: vars.font.serif,
  fontSize: '36px',
  fontWeight: 500,
  letterSpacing: '-0.5px',
  lineHeight: 1.15,
  color: vars.color.creamText,
  marginBottom: vars.space.md,
});

export const ctaDesc = style({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: 1.6,
  color: vars.color.creamSoft,
  maxWidth: '420px',
  margin: `0 auto ${vars.space.lg}`,
});

export const ctaButton = style({
  display: 'inline-block',
  background: vars.color.goldPrimary,
  color: vars.color.onGold,
  borderRadius: vars.radius.sm,
  padding: '14px 32px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  minHeight: '48px',
  transition: 'background 0.2s',
  ':hover': {
    background: vars.color.creamText,
  },
});

export const ctaFootnote = style({
  fontSize: '12px',
  color: vars.color.goldMuted,
  letterSpacing: '0.5px',
  marginTop: vars.space.md,
});

/* ── unlocked ── */
export const unlockedSection = style({
  padding: `${vars.space.section} ${vars.space.lg}`,
  maxWidth: '720px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
});

export const unlockedEyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  textAlign: 'center',
  marginBottom: vars.space.md,
});

export const unlockedTitle = style({
  fontFamily: vars.font.serif,
  fontSize: '44px',
  fontWeight: 500,
  letterSpacing: '-1px',
  lineHeight: 1.1,
  color: vars.color.creamText,
  textAlign: 'center',
  marginBottom: vars.space.xxl,
});
