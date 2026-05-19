import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { findBySessionToken } from '@/lib/db/purchases';
import { SajuCard } from '@/components/SajuCard/SajuCard';
import { buildArchetypeText } from '@/components/SajuCard/buildArchetypeText';
import { ELEMENT_META } from '@/lib/saju/types';
import { CardActions } from './CardActions';
import * as s from './page.css';

interface PageProps {
  params: Promise<{ session_token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { session_token } = await params;
  const purchase = await findBySessionToken(session_token).catch(() => null);

  if (!purchase || purchase.status !== 'paid') {
    return { title: 'Saju Card · Elemental-U' };
  }

  const name = purchase.name || 'Anonymous';
  const archetype = ELEMENT_META[purchase.saju_result.dominantElement].archetype;
  const description = buildArchetypeText(
    purchase.saju_result.dominantElement,
    purchase.saju_result.dayMaster,
  );

  /* Absolute URL needed so social previewers (Twitter/X, Discord, Kakao,
     iMessage) can fetch the PNG. NEXT_PUBLIC_SITE_URL is the production
     domain; in local dev the OG image is still reachable but link previews
     only matter on prod. */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const imageUrl = `${siteUrl}/api/card/${session_token}/image`;

  return {
    title: `${name}'s Saju Reading · Elemental-U`,
    description,
    openGraph: {
      title: `${name} walks the path of ${archetype}`,
      description,
      type: 'article',
      images: [{ url: imageUrl, width: 1080, height: 1080 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name}'s Saju Reading`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { session_token } = await params;
  const purchase = await findBySessionToken(session_token).catch(() => null);

  if (!purchase) notFound();
  if (purchase.status !== 'paid') notFound();
  if (!purchase.saju_result) notFound();

  const archetypeText = buildArchetypeText(
    purchase.saju_result.dominantElement,
    purchase.saju_result.dayMaster,
  );
  const name = purchase.name || 'Anonymous';

  return (
    <main className={s.page}>
      <header className={s.header}>
        <Link href="/" className={s.brandLink}>
          ← Elemental-U
        </Link>
      </header>

      <section className={s.cardSection}>
        <h1 className={s.subtitle}>Your destiny card</h1>
        <p className={s.eyebrow}>四柱命理 · Save or share</p>

        <div className={s.cardFrame}>
          <div className={s.cardScale}>
            <SajuCard
              name={name}
              birthDate={purchase.birth_date}
              sajuResult={purchase.saju_result}
              archetypeText={archetypeText}
            />
          </div>
        </div>

        <CardActions sessionToken={session_token} cardName={name} />
      </section>
    </main>
  );
}
