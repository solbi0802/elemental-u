import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const outer = style({
  maxWidth: '1280px',
  margin: '0 auto',
  padding: `${vars.space.section} ${vars.space.lg}`,
  position: 'relative',
  zIndex: 1,
});

export const colorBlock = style({
  background: vars.color.canvasSoft,
  border: `1px solid ${vars.color.hairline}`,
  borderRadius: vars.radius.xl,
  padding: vars.space.xxl,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  selectors: {
    /* Corner brackets */
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '28px',
      height: '28px',
      borderColor: vars.color.goldLine,
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

export const chartHeader = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
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

export const title = style({
  fontFamily: vars.font.serif,
  fontSize: '44px',
  fontWeight: 500,
  letterSpacing: '-1px',
  lineHeight: 1.1,
  color: vars.color.creamText,
  marginBottom: vars.space.md,
  textAlign: 'center',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '30px',
    },
  },
});

export const masterCard = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  background: vars.color.canvasElevated,
  border: `1px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.md,
  padding: '10px 20px',
  marginBottom: vars.space.xl,
  margin: `0 0 ${vars.space.xl}`,
});

export const masterLabel = style({
  fontFamily: vars.font.mono,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
});

export const masterValue = style({
  fontSize: '14px',
  fontWeight: 600,
  color: vars.color.creamText,
});

export const chartWrap = style({
  width: '100%',
  maxWidth: '520px',
  position: 'relative',
  margin: 0,
});

export const svg = style({
  width: '100%',
  overflow: 'visible',
});

/* Tooltip — HTML layer above SVG */
export const tooltip = style({
  position: 'absolute',
  background: vars.color.canvasDeep,
  border: `1px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.md,
  width: '220px',
  zIndex: 50,
  pointerEvents: 'none',
  transform: 'translateX(-50%)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
});

export const tooltipTitle = style({
  fontSize: '14px',
  fontWeight: 700,
  color: vars.color.creamText,
  marginBottom: '2px',
});

export const tooltipArchetype = style({
  fontSize: '13px',
  fontWeight: 400,
  color: vars.color.creamSoft,
  marginBottom: vars.space.sm,
});

export const traitRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xxs,
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const trait = style({
  fontSize: '11px',
  fontWeight: 500,
  padding: '3px 10px',
  borderRadius: vars.radius.pill,
  background: 'rgba(212, 168, 87, 0.12)',
  color: vars.color.creamSoft,
  border: `1px solid ${vars.color.hairline}`,
});

export const legend = style({
  display: 'flex',
  gap: vars.space.xl,
  marginTop: vars.space.lg,
  fontSize: '12px',
  fontFamily: vars.font.mono,
  letterSpacing: '1px',
  color: vars.color.creamSoft,
  listStyle: 'none',
  padding: 0,
});

export const legendItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontWeight: 500,
});

export const pillarsWrap = style({
  marginTop: vars.space.xxl,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.md,
});

export const pillarsLabel = style({
  fontFamily: vars.font.mono,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  margin: 0,
});

export const pillarsRow = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
});

export const pillarCard = style({
  background: vars.color.canvasDeep,
  border: `1px solid ${vars.color.hairline}`,
  borderRadius: vars.radius.md,
  padding: '16px 20px',
  textAlign: 'center',
  minWidth: '90px',
  transition: 'border-color 0.2s',
  ':hover': {
    borderColor: vars.color.goldLine,
  },
});

export const pillarTitle = style({
  fontFamily: vars.font.mono,
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: vars.color.goldMuted,
  marginBottom: vars.space.xs,
});

export const pillarDefinition = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const pillarHanja = style({
  display: 'block',
  fontFamily: vars.font.hanja,
  fontSize: '26px',
  fontWeight: 700,
  lineHeight: 1.1,
});

export const pillarSub = style({
  display: 'block',
  fontFamily: vars.font.hanja,
  fontSize: '18px',
  fontWeight: 500,
  opacity: 0.7,
  lineHeight: 1.3,
});

export const pillarRomanji = style({
  display: 'block',
  fontFamily: vars.font.mono,
  fontSize: '10px',
  letterSpacing: '0.5px',
  color: vars.color.goldMuted,
  marginTop: vars.space.xxs,
});
