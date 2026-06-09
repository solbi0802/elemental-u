import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter/SiteFooter';
import * as s from '../legal.css';

export default function PrivacyPage() {
  return (
    <main className={s.page}>
      <article className={s.article}>
        <Link href="/" className={s.back}>Back to Elemental-U</Link>
        <h1 className={s.title}>Privacy Policy</h1>
        <p className={s.updated}>Last updated: June 9, 2026</p>

        <section className={s.section}>
          <h2>Data used for readings</h2>
          <p>
            Elemental-U processes the name, birth date, and optional birth time
            you enter to calculate a chart and generate an AI-assisted reading.
            During the free beta, Elemental-U does not intentionally persist
            these inputs or generated readings in its application database.
          </p>
        </section>

        <section className={s.section}>
          <h2>AI processing</h2>
          <p>
            Chart information and the name you provide are sent to Google&apos;s
            Gemini API to generate the reading. Google processes that request
            under its applicable API terms and privacy practices. Do not enter
            sensitive information beyond what the form requests.
          </p>
        </section>

        <section className={s.section}>
          <h2>Analytics</h2>
          <p>
            The app emits product events such as chart completion, reading
            completion, section views, and sharing actions. These events are
            designed not to include names, birth dates, birth times, or reading
            text. If an analytics provider is enabled, its own privacy terms
            will also apply.
          </p>
        </section>

        <section className={s.section}>
          <h2>Abuse prevention</h2>
          <p>
            The production service stores a one-way keyed hash derived from the
            requesting network address, along with a request count and expiry
            time. This is used only to enforce reading limits and control API
            abuse. The raw address is not stored in the rate-limit table.
          </p>
        </section>

        <section className={s.section}>
          <h2>Sharing</h2>
          <p>
            Destiny cards are shared as image files rather than public URLs.
            The image can display the name and birth date used for the card, so
            only share it with recipients you choose.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
