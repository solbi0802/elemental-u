import Link from 'next/link';
import * as s from './SiteFooter.css';

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <p className={s.brand}>Elemental-U</p>
      <nav className={s.links} aria-label="Legal and support">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/disclaimer">Disclaimer</Link>
        <Link href="/support">Support</Link>
      </nav>
      <p className={s.note}>
        AI-assisted Saju for entertainment and self-reflection.
      </p>
    </footer>
  );
}
