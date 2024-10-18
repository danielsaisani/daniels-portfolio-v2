"use client"

import Link from 'next/link';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const socialLinks = [
  { key: 'instagram', href: 'https://www.instagram.com/dxnielks.io/', icon: '/instagram.svg', width: 36, height: 36 },
  { key: 'tiktok', href: 'https://www.tiktok.com/@dks', icon: '/tiktok.svg', width: 30, height: 30 },
  //   { key: 'twitter', href: 'https://www.tiktok.com/@dks', icon: '/twitter.svg', width: 36, height: 36 },
  //   { key: 'github', href: 'https://www.tiktok.com/@dks', icon: '/github.svg', width: 36, height: 36 },
  //   { key: 'linkedin', href: 'https://www.tiktok.com/@dks', icon: '/linkedin.svg', width: 36, height: 36 },

];

export function BottomBar() {
  const currentPage = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollBottom = scrollTop + windowHeight;

      // Show footer when near the bottom of the page
      setVisible(documentHeight - scrollBottom < 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className={`
      ${currentPage.startsWith('/blog') ? "hidden" : ""}
      tracking-tight bg-dark fixed bottom-0 left-0 right-0
      transition-transform duration-300 ease-in-out
      ${visible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className={'p-2'}>
        <div className="flex justify-center items-center h-[5rem] px-2">
          <div className={'flex items-center gap-4 space-x-0'}>
            {socialLinks.map(({ key, href, icon, width, height }) => (
              <Link
                key={key}
                href={href}
                target={'_blank'}
                rel="noopener noreferrer"
                className="py-1 px-2 hover:-translate-y-1 duration-300"
              >
                <Image src={icon} alt={key} width={width} height={height} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}