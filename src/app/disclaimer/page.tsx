import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import * as s from '../legal.css';

export default function DisclaimerPage() {
  return (
    <main className={s.page}>
      <article className={s.article}>
        <Link href="/" className={s.back}>Back to Elemental-U</Link>
        <h1 className={s.title}>Disclaimer</h1>
        <p className={s.updated}>Last updated: June 9, 2026</p>

        <section className={s.section}>
          <h2>Entertainment and reflection</h2>
          <p>
            Saju readings are cultural and interpretive content intended for
            entertainment and personal reflection. They are not statements of
            fact and should not be treated as certain predictions.
          </p>
        </section>

        <section className={s.section}>
          <h2>Professional advice</h2>
          <p>
            Health, wellness, career, relationship, and money sections are not
            medical, mental-health, legal, financial, investment, or other
            professional advice. Consult a qualified professional for decisions
            in those areas.
          </p>
        </section>

        <section className={s.section}>
          <h2>AI limitations</h2>
          <p>
            AI can produce incorrect, repetitive, or inappropriate statements.
            Use your own judgment and do not make significant decisions solely
            from a generated reading.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
