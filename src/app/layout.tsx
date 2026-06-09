import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: '../../public/fonts/Inter-Regular.woff',
  variable: '--font-sans',
  display: 'swap',
});

const serif = localFont({
  src: [
    {
      path: '../../public/fonts/Cormorant-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Cormorant-MediumItalic.woff',
      weight: '500',
      style: 'italic',
    },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const hanja = localFont({
  src: '../../public/fonts/NotoSerifKR-Bold.otf',
  variable: '--font-hanja',
  weight: '700',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Elemental-U';
const DEFAULT_TITLE = 'Elemental-U · Korean Four Pillars Reading';
const DEFAULT_DESCRIPTION =
  'Explore a free AI-assisted Four Pillars reading with elemental themes for life, career, relationships, wellbeing, and money habits.';

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
    'Four Pillars',
    'Five Elements',
    'birth chart',
    'AI reading',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: 'lifestyle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${inter.variable} ${serif.variable} ${hanja.variable}`}
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>{children}</body>
    </html>
  );
}
