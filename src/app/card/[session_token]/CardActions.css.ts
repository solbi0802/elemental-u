import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const row = style({
  display: 'flex',
  gap: vars.space.md,
  marginTop: vars.space.lg,
  flexWrap: 'wrap',
  justifyContent: 'center',
});

/* Outlined gold pill — same family as the "View your destiny card" link
   in Paywall and the "Continue reading" cta in ElementTeaser. Save and
   Share are both secondary actions on this page, not primary CTAs, so
   they take the outlined treatment rather than the filled-gold variant
   used for purchase / submit. */
export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.mono,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2.5px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  background: 'transparent',
  padding: `${vars.space.sm} ${vars.space.lg}`,
  border: `1px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.pill,
  cursor: 'pointer',
  textDecoration: 'none',
  minHeight: '40px',
  transition: 'background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s',
  ':hover': {
    background: vars.color.goldPrimary,
    color: vars.color.onGold,
    borderColor: vars.color.goldPrimary,
  },
  ':disabled': {
    color: vars.color.goldMuted,
    borderColor: vars.color.goldMuted,
    background: 'transparent',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
});
