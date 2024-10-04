"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
          className='text-2xl' 
          width={30} 
          height={30} 
          src={mobileOpen ? '/pause-outline.svg' : '/menu-outline.svg'} 
          alt='menu' 
        />
      </div>
      <div className={`md:flex ${mobileOpen ? 'flex' : 'hidden'} flex-col md:flex-row justify-start items-center gap-4 md:gap-10 md:space-x-0 pr-10`}>
        {Object.entries(navItems).map(([path, { name }]) => {
          return (
            <Link
              key={path}
              href={path}
              className={`${path === currentPage ? 'font-extrabold' : 'font-light'} duration-300 transition-all hover:-translate-y-1 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2`}
              onClick={() => setMobileOpen(false)}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}