"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SITE_NAME, SITE_LOGO, NAV_LINKS } from '../../constants/mockData';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lng = pathname?.split('/')[1] || 'en';

  // Fallback links
  const menuLinks = NAV_LINKS && NAV_LINKS.length > 0 ? NAV_LINKS : [
    { name: "Conflict Monitor", href: "/category/conflict" },
    { name: "Humanitarian", href: "/category/humanitarian" }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
            <Link href={`/${lng}`} className="shrink-0 flex items-center ml-2 md:ml-0">
              <span className="font-serif text-xl md:text-2xl font-black tracking-tight text-gray-900 hover:text-red-700">
                
                {SITE_LOGO && (
                  <Image src={SITE_LOGO} alt={`${SITE_NAME} Logo`} width={32} height={32} className="inline-block h-8 w-auto ml-2" />
                )}
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {menuLinks.map((link) => (
                <Link key={link.name} href={`/${lng}${link.href}`} className="inline-flex items-center px-1 pt-1 text-xs lg:text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wide">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-900" title="Search" aria-label="Search">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <button onClick={logout} className="text-sm font-bold text-gray-500 hover:text-red-600">Log Out</button>
              ) : (
                <Link href={`/${lng}/signup`} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700">Subscribe</Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full z-50">
          <div className="px-4 py-4 space-y-3">
            {menuLinks.map((link) => (
              <Link key={link.name} href={`/${lng}${link.href}`} className="block text-sm font-bold text-gray-500 hover:text-red-600">
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-900" title="Search" aria-label="Search">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
                {user ? (
                  <button onClick={logout} className="text-sm font-bold text-gray-500 hover:text-red-600">Log Out</button>
                ) : (
                  <Link href={`/${lng}/signup`} className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700">Subscribe</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}