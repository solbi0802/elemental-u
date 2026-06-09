import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const card = style({
  position: 'relative',
  borderRadius: vars.radius.lg,
  padding: vars.space.xl,
  marginBottom: vars.space.lg,
  border: `1px solid ${vars.color.hairline}`,
  overflow: 'hidden',
});

export const variantA = style({
  background: vars.color.canvasSoft,
  color: vars.color.creamText,
  borderColor: vars.color.hairlineStrong,
});

export const variantB = style({
  background: vars.color.canvasDeep,
  color: vars.color.creamText,
  borderColor: vars.color.goldLine,
  borderWidth: '1.5px',
});

export const variantC = style({
  background: vars.color.canvasElevated,
  color: vars.color.creamText,
  borderColor: vars.color.hairline,
});

export const seal = style({
  position: 'absolute',
  top: vars.space.md,
  right: vars.space.md,
  opacity: 0.9,
  transform: 'rotate(-6deg)',
});

export const cardHeader = style({
  marginBottom: vars.space.lg,
});

export const eyebrow = style({
  fontFamily: vars.font.mono,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  margin: `0 0 ${vars.space.sm}`,
});

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
});

export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  border: `1px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.pill,
  fontFamily: vars.font.mono,
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  color: vars.color.goldPrimary,
  flexShrink: 0,
});

export const title = style({
  fontFamily: vars.font.serif,
  fontSize: '28px',
  fontWeight: 600,
  letterSpacing: '-0.5px',
  lineHeight: 1.2,
  color: vars.color.creamText,
});

export const body = style({
  fontSize: '15px',
  fontWeight: 400,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
  color: vars.color.creamSoft,
  margin: 0,
});

export const insight = style({
  marginTop: vars.space.lg,
  padding: vars.space.md,
  background: 'rgba(212, 168, 87, 0.1)',
  border: `1px solid ${vars.color.hairlineStrong}`,
  borderRadius: vars.radius.sm,
});

export const insightLabel = style({
  fontFamily: vars.font.mono,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  margin: `0 0 ${vars.space.xxs}`,
  color: vars.color.goldPrimary,
});

export const insightText = style({
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.55,
  color: vars.color.creamText,
  margin: 0,
});
