import './global.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Navbar } from './components/ui/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SandpackCSS } from './blog/[slug]/sandpack';
import LenisProvider from './components/LenisProvider';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Daniel Saisani',
    template: '%s | Daniel Saisani',
  },
  description: 'Engineer, innovator, and content creator.',
  openGraph: {
    title: 'Daniel Saisani',
    description: 'Engineer, innovator, and content creator.',
    url: siteUrl,
    siteName: 'Daniel Saisani',
    locale: 'en_US',
    type: 'website',
    images: [`${siteUrl}/opengraph-image-v2.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Daniel Saisani',
    card: 'summary_large_image',
  },
  verification: {
    google: 'eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw',
    yandex: '14d2e73487fa6c71',
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html
      lang="en"
      className={cx(
        'text-light bg-dark no-scrollbar',
        poppins.className,
      )}
    >
      <head>
        <link rel="icon" href="/img/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link rel="manifest" href="/img/site.webmanifest" />
        <SandpackCSS />
      </head>
      <body className="max-w-2xl flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
        <LenisProvider>
          <main className="flex-auto min-w-0 flex flex-col px-2 md:px-0 gap-20">
            <Navbar />
            {children}
            <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-dark to-transparent pointer-events-none"></div>
            <Analytics />
            <SpeedInsights />
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
