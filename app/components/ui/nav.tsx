"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = {
  '/': {
    name: 'home',
  },
  // '/work': {
  //   name: 'work',
  // },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(currentScrollPos < 30);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <nav className={`tracking-tight -ml-[8px] ease-in-out transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className='flex w-full justify-start cursor-pointer md:hidden'>
        <Image
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`text-2xl ${mobileOpen ? 'rotate-90' : ''} duration-300`}
          width={30}
          height={30}
          src={'/menu-outline.svg'}
          alt='menu'
        />
      </div>
      <div 
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          md:h-auto md:opacity-100
          ${mobileOpen ? 'h-64' : 'h-0'}
        `}
      >
        <div className={`
          flex flex-col md:flex-row justify-start items-center gap-4 md:gap-10 md:space-x-0 pr-10
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}
          md:translate-y-0
        `}>
          {Object.entries(navItems).map(([path, { name }]) => {
            return (
              <Link
                key={path}
                href={path}
                className={`${path === currentPage ? 'font-bold' : 'font-light'} duration-300 transition-all hover:-translate-y-1 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2`}
                onClick={() => setMobileOpen(false)}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}