import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const section = style({
  maxWidth: '640px',
  margin: '0 auto',
  padding: `${vars.space.xxl} ${vars.space.lg}`,
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

export const eyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  marginBottom: vars.space.md,
});

export const headline = style({
  fontFamily: vars.font.serif,
  fontSize: '40px',
  fontWeight: 500,
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
  color: vars.color.creamText,
  marginBottom: vars.space.lg,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '30px',
    },
  },
});

export const archetype = style({
  fontStyle: 'italic',
  color: vars.color.goldPrimary,
});

export const body = style({
  fontSize: '17px',
  fontWeight: 400,
  lineHeight: 1.7,
  color: vars.color.creamSoft,
  marginBottom: vars.space.xl,
  maxWidth: '540px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

export const divider = style({
  width: '60px',
  height: '1px',
  background: vars.color.goldLine,
  margin: `0 auto ${vars.space.xl}`,
  border: 'none',
});

export const snippet = style({
  position: 'relative',
  maxWidth: '560px',
  margin: `0 auto ${vars.space.lg}`,
  padding: `${vars.space.lg} ${vars.space.md} ${vars.space.xxl}`,
  textAlign: 'left',
});

export const snippetMark = style({
  fontFamily: vars.font.serif,
  fontSize: '48px',
  fontWeight: 700,
  lineHeight: 1,
  color: vars.color.goldLine,
  display: 'block',
  marginBottom: vars.space.xs,
  opacity: 0.8,
});

export const snippetText = style({
  fontFamily: vars.font.serif,
  fontStyle: 'italic',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: vars.color.creamText,
  /* Soft fade on the bottom edge — suggests "there is more" */
  maskImage: 'linear-gradient(180deg, black 0%, black 62%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 62%, transparent 100%)',
});

export const loaderSlot = style({
  maxWidth: '560px',
  margin: `0 auto ${vars.space.lg}`,
});

export const cta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  background: 'none',
  border: 'none',
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2.5px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  cursor: 'pointer',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.goldLine}`,
  transition: 'color 0.2s, border-color 0.2s, transform 0.2s',
  ':hover': {
    color: vars.color.creamText,
    borderBottomColor: vars.color.creamText,
    transform: 'translateY(2px)',
  },
  ':disabled': {
    color: vars.color.goldMuted,
    borderBottomColor: vars.color.goldMuted,
    cursor: 'not-allowed',
    opacity: 0.7,
  },
});
