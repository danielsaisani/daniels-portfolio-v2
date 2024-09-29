"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const navItems = {
  '/': {
    name: 'home',
  },
  '/work': {
    name: 'work',
  },
  '/blog': {
    name: 'blog',
  },
  '/guestbook': {
    name: 'guestbook',
  },
};

export function Navbar() {

  const currentPage = usePathname();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(currentScrollPos < 5);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <aside className={`tracking-tight ease-in-out sticky top-0 -ml-[8px] transition-transform mb-16 duration-300"
      ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row justify-center relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row flex-grow justify-start gap-10 space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className={`${path === currentPage ? 'font-extrabold' : 'font-light'} duration-300 transition-all hover:-translate-y-1 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2`}
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
