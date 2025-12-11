import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SITE_NAME, NAV_LINKS } from '../../constants/mockData';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fallback: Ensure we always have an array, even if import fails slightly
  const menuLinks = NAV_LINKS && NAV_LINKS.length > 0 ? NAV_LINKS : [
    { name: "Conflict Monitor", href: "/category/conflict" },
    { name: "Humanitarian", href: "/category/humanitarian" }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* === LEFT SIDE: HAMBURGER & LOGO === */}
          <div className="flex items-center">
            
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="md:hidden p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center ml-2 md:ml-0">
              <span className="font-serif text-xl md:text-2xl font-black tracking-tight text-gray-900 hover:text-red-700 transition-colors">
                {SITE_NAME}
              </span>
            </Link>

            {/* DESKTOP LINKS (Hidden on Mobile) */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {menuLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="inline-flex items-center px-1 pt-1 text-xs lg:text-sm font-bold text-gray-500 hover:text-red-600 uppercase tracking-wide transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* === RIGHT SIDE: SEARCH & AUTH === */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-900" title="Search" aria-label="Search">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Desktop Auth Buttons (Hidden on Mobile) */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">Hi, <b>{user.username}</b></span>
                  {user.username === 'Admin' && (
                     <Link href="/admin/posts" className="text-sm font-bold text-blue-600 hover:underline">Admin</Link>
                  )}
                  <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600">Log Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-red-600">Log In</Link>
                  <Link href="/signup" className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors">Subscribe</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE MENU DROPDOWN === */}
      {/* This renders only when hamburger is clicked */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50">
          <div className="px-4 pt-2 pb-6 space-y-2">
            
            {/* 1. The Category Links (The missing part!) */}
            {menuLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 border-b border-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* 2. Mobile Auth Buttons */}
            <div className="mt-4 pt-4">
              {user ? (
                 <div className="px-3 space-y-3">
                   <p className="text-sm text-gray-500">Signed in as <span className="font-bold text-gray-900">{user.username}</span></p>
                   {user.username === 'Admin' && (
                     <Link 
                       href="/admin/posts" 
                       className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                       onClick={() => setIsMobileMenuOpen(false)}
                     >
                       Admin Dashboard
                     </Link>
                   )}
                   <button 
                     onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                     className="block w-full text-left text-red-600 font-bold py-2"
                   >
                     Sign Out
                   </button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 px-3">
                  <Link 
                    href="/login" 
                    className="flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex justify-center items-center px-4 py-3 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Subscribe
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}