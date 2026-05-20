import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: `${vars.space.section} ${vars.space.lg}`,
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
});

export const heroHeader = style({
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
  marginBottom: vars.space.lg,
  padding: '6px 18px',
  border: `1px solid ${vars.color.hairlineStrong}`,
  borderRadius: vars.radius.pill,
});

export const heading = style({
  fontFamily: vars.font.serif,
  fontSize: '72px',
  fontWeight: 500,
  letterSpacing: '-2px',
  lineHeight: 1.0,
  color: vars.color.creamText,
  maxWidth: '720px',
  marginBottom: vars.space.lg,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '44px',
      letterSpacing: '-1px',
    },
  },
});

export const headingAccent = style({
  color: vars.color.goldPrimary,
  fontStyle: 'italic',
});

export const subtitle = style({
  fontSize: '18px',
  fontWeight: 400,
  lineHeight: 1.6,
  color: vars.color.creamSoft,
  maxWidth: '520px',
  marginBottom: vars.space.xxl,
});

export const formCard = style({
  position: 'relative',
  background: vars.color.canvasSoft,
  border: `1.5px solid ${vars.color.goldLine}`,
  borderRadius: vars.radius.lg,
  padding: `${vars.space.xl} ${vars.space.lg}`,
  width: '100%',
  maxWidth: '440px',
  textAlign: 'left',
  selectors: {
    /* Corner brackets — top-left and bottom-right */
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      width: '24px',
      height: '24px',
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

export const fieldGroup = style({
  marginBottom: vars.space.md,
});

export const fieldset = style({
  border: 'none',
  padding: 0,
  margin: `0 0 ${vars.space.md}`,
  minWidth: 0,
});

export const fieldLabel = style({
  display: 'block',
});

export const fieldLabelText = style({
  display: 'block',
  fontFamily: vars.font.mono,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: vars.color.goldPrimary,
  marginBottom: vars.space.xs,
  padding: 0,
});

export const dateRow = style({
  display: 'grid',
  /* Day · Month · Year — DMY is the dominant English-speaking convention
     outside the US (UK, AU, NZ, IE, IN, ZA, EU). Day select is narrow
     (1-31), Month is widest (full English names up to "September"), Year
     fits 4 digits. */
  gridTemplateColumns: '1fr 1.6fr 1.3fr',
  gap: vars.space.sm,
  '@media': {
    'screen and (max-width: 420px)': {
      gridTemplateColumns: '1fr',
    },
  },
});


export const fieldOptional = style({
  fontWeight: 400,
  color: vars.color.goldMuted,
  textTransform: 'none',
  letterSpacing: '0',
});

export const fieldInput = style({
  width: '100%',
  background: vars.color.canvasDeep,
  border: `1px solid ${vars.color.hairline}`,
  borderRadius: vars.radius.sm,
  padding: '12px 14px',
  color: vars.color.creamText,
  fontSize: '15px',
  outline: 'none',
  height: '44px',
  transition: 'border-color 0.2s',
  fontFamily: vars.font.sans,
  minWidth: 0,
  ':focus': {
    borderColor: vars.color.goldPrimary,
  },
  '::placeholder': {
    color: vars.color.creamMuted,
  },
  /* Hide spinner buttons on number inputs (browser-native, look broken on dark canvas) */
  selectors: {
    '&[type="number"]::-webkit-outer-spin-button, &[type="number"]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type="number"]': {
      MozAppearance: 'textfield',
    },
  },
});

/* Gold chevron SVG embedded as background-image so the select arrow stays
   on-brand on the dark jade canvas. */
const CHEVRON_GOLD =
  'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27 fill=%27none%27><path d=%27M1 1.5l5 5 5-5%27 stroke=%27%23d4a857%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/></svg>")';

export const fieldSelect = style({
  width: '100%',
  background: vars.color.canvasDeep,
  backgroundImage: CHEVRON_GOLD,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '12px 8px',
  border: `1px solid ${vars.color.hairline}`,
  borderRadius: vars.radius.sm,
  padding: '12px 36px 12px 14px',
  color: vars.color.creamText,
  fontSize: '15px',
  outline: 'none',
  height: '44px',
  transition: 'border-color 0.2s',
  fontFamily: vars.font.sans,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  minWidth: 0,
  ':focus': {
    borderColor: vars.color.goldPrimary,
  },
  /* Native option list inherits OS colors — we accept that. Limiting risk by
     using common values (numbers + English month names) keeps it readable
     even when the dropdown adopts system styling. */
});

export const fieldError = style({
  fontSize: '13px',
  color: vars.color.error,
  marginTop: vars.space.xxs,
});

export const submitButton = style({
  width: '100%',
  background: vars.color.goldPrimary,
  color: vars.color.onGold,
  borderRadius: vars.radius.sm,
  padding: '14px 20px',
  border: 'none',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  height: '48px',
  marginTop: vars.space.lg,
  transition: 'background 0.2s',
  ':hover': {
    background: vars.color.creamText,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const footnote = style({
  display: 'block',
  fontSize: '12px',
  color: vars.color.goldMuted,
  letterSpacing: '0.5px',
  marginTop: vars.space.xl,
});
