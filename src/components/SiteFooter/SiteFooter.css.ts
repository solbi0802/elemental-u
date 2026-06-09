import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const footer = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.xl} ${vars.space.lg}`,
  borderTop: `1px solid ${vars.color.hairline}`,
  color: vars.color.creamMuted,
  textAlign: 'center',
});

export const brand = style({
  fontFamily: vars.font.serif,
  fontSize: '20px',
  color: vars.color.creamText,
});

export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: vars.space.lg,
  fontSize: '13px',
});

globalStyle(`${links} a:hover`, {
  color: vars.color.goldPrimary,
});

export const note = style({
  fontSize: '11px',
  lineHeight: 1.5,
});
