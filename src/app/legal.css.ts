import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const page = style({
  position: 'relative',
  zIndex: 1,
  minHeight: '100vh',
});

export const article = style({
  maxWidth: '760px',
  margin: '0 auto',
  padding: `${vars.space.section} ${vars.space.lg}`,
});

export const back = style({
  display: 'inline-block',
  marginBottom: vars.space.xl,
  color: vars.color.goldPrimary,
  fontFamily: vars.font.mono,
  fontSize: '12px',
  letterSpacing: '1px',
});

export const title = style({
  fontFamily: vars.font.serif,
  fontSize: '48px',
  lineHeight: 1.1,
  color: vars.color.creamText,
  marginBottom: vars.space.sm,
});

export const updated = style({
  color: vars.color.creamMuted,
  fontSize: '12px',
  marginBottom: vars.space.xxl,
});

export const section = style({
  marginBottom: vars.space.xl,
});

globalStyle(`${section} h2`, {
  fontFamily: vars.font.serif,
  fontSize: '26px',
  color: vars.color.goldPrimary,
  marginBottom: vars.space.sm,
});

globalStyle(`${section} p, ${section} li`, {
  fontSize: '15px',
  lineHeight: 1.75,
  color: vars.color.creamSoft,
});

globalStyle(`${section} ul`, {
  paddingLeft: vars.space.lg,
});

globalStyle(`${section} a`, {
  color: vars.color.goldPrimary,
  textDecoration: 'underline',
});
