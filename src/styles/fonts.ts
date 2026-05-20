/* Centralized font-family stacks for places where reliance on the
   var(--font-hanja) CSS variable isn't enough — specifically inline SVG
   <text> elements, which can fail to resolve CSS custom properties on
   Mobile Safari / older Android WebView. The fallback chain includes
   the OS-bundled CJK fonts so a hanja character renders SOMETHING
   useful even if next/font hasn't finished loading or the CSS variable
   doesn't pick up.

   "Times New Roman" / "Georgia" deliberately omitted — they lack CJK
   glyphs and produce empty tofu boxes for any hanja that falls through
   to them. */

export const HANJA_FONT_STACK = [
  'var(--font-hanja)',
  '"Noto Serif KR"',
  /* iOS / iPadOS */
  '"Apple SD Gothic Neo"',
  '"AppleGothic"',
  /* macOS */
  '"Nanum Myeongjo"',
  /* Windows */
  '"Malgun Gothic"',
  /* Fallback CJK for any platform we missed */
  '"Hiragino Sans GB"',
  '"Heiti SC"',
  '"Microsoft YaHei"',
  'serif',
].join(', ');
