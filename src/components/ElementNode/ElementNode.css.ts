import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const nodeGroup = style({
  cursor: 'pointer',
});

export const tooltip = style({
  background: vars.color.canvasDeep,
  border: `1px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.lg,
  padding: vars.space.md,
  width: '210px',
  zIndex: 100,
  pointerEvents: 'none',
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
