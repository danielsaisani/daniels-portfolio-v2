import './global.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Poppins } from 'next/font/google'
import { Navbar } from './components/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SandpackCSS } from './blog/[slug]/sandpack';
import { CSPostHogProvider } from './providers'
import BottomBar from "./components/BottomBar";
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL!),
  title: {
    default: 'Daniel Saisani',
    template: '%s | Daniel Saisani',
  },
  description: 'Engineer, innovator, and content creator.',
  openGraph: {
    title: 'Daniel Saisani',
    description: 'Engineer, innovator, and content creator.',
    url: process.env.BASE_URL,
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

const poppins = Poppins({ weight:"500", subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const isBlogPage = pathname.startsWith('/blog');

  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-[#111010]',
        poppins.className,
      )}
    >
    <CSPostHogProvider>
      <head>
        <link rel="icon" href="/img/favicon.ico" sizes="any"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png"/>
        <link rel="manifest" href="/img/site.webmanifest"/>
        <SandpackCSS/>
      </head>
      <body className="antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
      <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
        <Navbar/>
        {children}
        <Analytics/>
        <SpeedInsights/>
        {!isBlogPage && <BottomBar />}
      </main>
      </body>
    </CSPostHogProvider>
    </html>
  );
}
