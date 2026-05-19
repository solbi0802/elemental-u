import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const row = style({
  display: 'flex',
  gap: vars.space.md,
  marginTop: vars.space.md,
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.color.goldPrimary,
  color: vars.color.onGold,
  borderRadius: vars.radius.sm,
  padding: '14px 28px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  fontFamily: vars.font.sans,
  cursor: 'pointer',
  minHeight: '48px',
  textDecoration: 'none',
  transition: 'background 0.2s',
  ':hover': {
    background: vars.color.creamText,
  },
});
