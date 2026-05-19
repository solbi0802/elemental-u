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

export const metadata: Metadata = {
  title: 'Elemental-U — Discover Your Destiny Through Korean Astrology',
  description:
    'Unlock your Four Pillars of Destiny with ancient Korean astrology. Get personalized Five Elements analysis, life fortune, career, love, and health readings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${serif.variable} ${hanja.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
