import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import * as s from '../legal.css';

export default function TermsPage() {
  return (
    <main className={s.page}>
      <article className={s.article}>
        <Link href="/" className={s.back}>Back to Elemental-U</Link>
        <h1 className={s.title}>Terms of Use</h1>
        <p className={s.updated}>Last updated: June 9, 2026</p>

        <section className={s.section}>
          <h2>Free beta</h2>
          <p>
            Elemental-U is currently provided as a free beta. Features may
            change, become unavailable, or contain errors. No purchase is
            required and no refund policy applies while the product is free.
          </p>
        </section>

        <section className={s.section}>
          <h2>Permitted use</h2>
          <p>
            You may use the app for personal, lawful purposes. Do not abuse the
            service, attempt to disrupt it, automate excessive requests, or use
            generated content to mislead or harm another person.
          </p>
        </section>

        <section className={s.section}>
          <h2>No guarantees</h2>
          <p>
            Readings are generated from a simplified chart calculation and an
            AI model. Elemental-U does not guarantee accuracy, availability, or
            any particular future outcome.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
