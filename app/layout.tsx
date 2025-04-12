import './global.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Navbar } from './components/ui/nav';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SandpackCSS } from './blog/[slug]/sandpack';
import { CSPostHogProvider } from './providers';
import { BottomBar } from "./components/ui/bottom-bar";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
        inter.className,
      )}
    >
      <CSPostHogProvider>
        <head>
          <link rel="icon" href="/img/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
          <link rel="manifest" href="/img/site.webmanifest" />
          <SandpackCSS />
        </head>
        <body className="antialiased max-w-2xl flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
          <main className="flex-auto min-w-0 flex flex-col px-2 md:px-0 h-[100rem] gap-20">
            <Navbar />
            {children}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark to-transparent pointer-events-none"></div>
            <Analytics />
            <SpeedInsights />
            <BottomBar />
          </main>
          {/*<div className={"fixed bottom-0 left-0"}>*/}
          {/*  <div className={'text-black dark:text-white'}>*/}
          {/*  <Link href={'/uses'}>*/}
          {/*    <Button className={'outline-0'}>*/}
          {/*      <Image src={'/static/backpack.svg'} alt={'my backpack of gear'} width={20} height={20}/>*/}
          {/*    </Button>*/}
          {/*  </Link>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </body>
      </CSPostHogProvider>
    </html>
  );
}
