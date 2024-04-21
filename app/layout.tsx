import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navbar } from './components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SandpackCSS } from './blog/[slug]/sandpack';

export const metadata: Metadata = {
  metadataBase: new URL('https://danielsaisani.com'),
  title: {
    default: 'Daniel Saisani',
    template: '%s | Daniel Saisani',
  },
  description: 'Developer, writer, and creator.',
  openGraph: {
    title: 'Daniel Saisani',
    description: 'Engineer, entrepreneur, and creator.',
    url: 'https://danielsaisani.com',
    siteName: 'Daniel Saisani',
    locale: 'en_US',
    type: 'website',
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

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-[#111010]',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <SandpackCSS />
      </head>
      <body className="antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
      <div className="top-0 left-0 absolute size-20">
        <img
            className="object-cover object-center rounded h-8 lg:h-auto mr-4"
            alt="It's me! :)"
            src="./coding.png"
        />
      </div>
      <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
        <Navbar/>
        {children}
        <Analytics/>
        <SpeedInsights/>
      </main>
      </body>
    </html>
  );
}
