import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import * as s from '../legal.css';

export default function SupportPage() {
  return (
    <main className={s.page}>
      <article className={s.article}>
        <Link href="/" className={s.back}>Back to Elemental-U</Link>
        <h1 className={s.title}>Support</h1>
        <p className={s.updated}>Elemental-U free beta</p>

        <section className={s.section}>
          <h2>Report a problem</h2>
          <p>
            Please report bugs or content concerns through the{' '}
            <a
              href="https://github.com/solbi0802/elemental-u/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elemental-U issue tracker
            </a>
            . Do not include names, birth details, API keys, or other private
            information in a public report.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
