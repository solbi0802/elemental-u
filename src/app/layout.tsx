import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Cormorant_Garamond, Noto_Serif_KR } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

const hanja = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-hanja',
  preload: false,
});

/* metadataBase makes relative OG/Twitter image URLs resolve to the
   correct absolute URL, both in local dev and on Vercel. NEXT_PUBLIC_SITE_URL
   should be set in .env / Vercel project settings. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Elemental-U';
const DEFAULT_TITLE = 'Elemental-U — Discover Your Destiny Through Korean Astrology';
const DEFAULT_DESCRIPTION =
  'Unlock your Four Pillars of Destiny (四柱命理) with ancient Korean astrology. Personalized Five Elements analysis — life fortune, career, love, health, and wealth readings powered by AI.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s · Elemental-U',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'Korean astrology',
    'saju',
    '사주',
    'four pillars of destiny',
    '四柱命理',
    'Five Elements',
    '五行',
    'birth chart reading',
    'fortune telling',
    'Korean folk art',
    '민화',
    'destiny reading',
    'AI saju',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    /* opengraph-image.tsx in this same directory is auto-attached as
       og:image — Next.js handles the meta tag generation. */
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: 'lifestyle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* translate="no" — the site is English-only by design and the Hanja
       characters scattered through the SVG illustrations (木火土金水 in
       the pentagon, 壽福囍 in the seal strip, 命 in the loader, etc.)
       are decoration, not translatable text. Chrome / Edge auto-translation
       to Korean was emptying the single-Hanja <text> elements in SVG,
       leaving the element nodes blank. Suppressing translation site-wide
       keeps every decorative glyph intact. */
    <html
      lang="en"
      translate="no"
      className={`${inter.variable} ${mono.variable} ${serif.variable} ${hanja.variable}`}
    >
      <head>
        {/* Belt-and-suspenders: a few translation engines (notably Google
            Translate when invoked through the Translate bar rather than the
            in-page autodetect) respect this meta tag rather than the
            translate attribute. */}
        <meta name="google" content="notranslate" />
      </head>
      <body>{children}</body>
    </html>
  );
}
