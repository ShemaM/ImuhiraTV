// components/layouts/Header.tsx
import { useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS, SITE_NAME } from '../../constants/site';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

// ADD THIS INTERFACE
interface HeaderProps {
  onSearchClick: () => void;
  onSubscribeClick: () => void;
}

// ACCEPT PROPS HERE
export default function Header({ onSearchClick, onSubscribeClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const currentPathname = router.pathname;
    const currentQuery = router.query;
    
    // Replace the current lng parameter in the path
    const newPath = currentPathname.replace(/\/\[lng\]/, `/${newLocale}`);
    
    // Update the query to include the new lng
    const newQuery = { ...currentQuery, lng: newLocale };
    
    router.push({ pathname: newPath, query: newQuery }, undefined, { shallow: false });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-4 border-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          
          <Link href={`/${router.query.lng || 'en'}/`} className="flex flex-col group">
            <span className="text-2xl md:text-3xl font-black font-serif uppercase tracking-tighter leading-none text-slate-900 group-hover:text-red-700 transition-colors">
              {SITE_NAME}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 leading-none mt-1">
              {t('Conflict Monitor')}
            </span>
          </Link>

          {/* Desktop Nav - visible on sm screens and up for laptop support */}
          <nav className="hidden sm:flex items-center gap-4 lg:gap-8">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={`/${router.query.lng || 'en'}${link.href}`}
                className="text-[10px] lg:text-xs font-bold text-slate-500 hover:text-red-700 uppercase tracking-widest transition-colors"
              >
                {t(link.name)}
              </Link>
            ))}
            
            {/* Search Icon - CONNECTED */}
            <button 
              onClick={onSearchClick}
              className="text-slate-400 hover:text-slate-900 transition-colors"
              title="Search"
              aria-label="Search"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Subscribe CTA - CONNECTED */}
            <button 
              onClick={onSubscribeClick}
              className="bg-slate-900 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-sm text-[10px] lg:text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-sm"
            >
              {t('Subscribe')}
            </button>

            {/* Language Switcher */}
            <select
              onChange={onLangChange}
              value={router.query.lng as string || 'en'}
              className="text-[10px] lg:text-xs font-bold text-slate-500 hover:text-red-700 uppercase tracking-widest transition-colors bg-transparent"
              aria-label="Select language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="sw">SW</option>
              <option value="ki">KI</option>
            </select>
          </nav>

          {/* Mobile Menu Toggle - only visible on very small screens */}
          <button
            className="sm:hidden text-slate-900 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Open mobile menu"
            aria-label="Open mobile menu"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - CONNECTED */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 absolute left-0 right-0 shadow-xl z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {/* Navigation Links */}
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={`/${router.query.lng || 'en'}${link.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-red-700 uppercase tracking-widest transition-colors py-2"
              >
                {t(link.name)}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <select
              onChange={(e) => { onLangChange(e); setIsMobileMenuOpen(false); }}
              value={router.query.lng as string || 'en'}
              className="text-sm font-bold text-slate-500 hover:text-red-700 uppercase tracking-widest transition-colors bg-transparent py-2"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="sw">Kiswahili</option>
              <option value="ki">Kinyamulenge</option>
            </select>
            
            <div className="pt-4 flex flex-col gap-3 border-t border-slate-100">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onSearchClick(); }}
                className="w-full bg-slate-100 text-slate-900 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-slate-200"
              >
                {t('Search')}
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); onSubscribeClick(); }}
                className="w-full bg-red-700 text-white px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-800"
              >
                {t('Subscribe')}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}