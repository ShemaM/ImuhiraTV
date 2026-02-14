import React, { useState } from 'react';
import Head from 'next/head'; // Optional: Good for SEO
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '../common/Breadcrumbs';
import SearchModal from '../modals/SearchModal';     // Ensure you created this file
import SubscribeModal from '../modals/SubscriberModal'; // Ensure you created this file
import { SITE_NAME } from '../../constants/site';

interface LayoutProps {
  children: React.ReactNode;
  title?: string; // Optional: Allow pages to set their own title
}

export default function Layout({ children, title }: LayoutProps) {
  // 1. State to manage which modal is open
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // 2. Dynamic Page Title
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    // Softer background with subtle gradient using brand color shades
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-red-50/20 font-sans text-slate-900 flex flex-col selection:bg-red-100 selection:text-red-900">
      
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 3. Pass the "Open" functions to the Header buttons */}
      <Header 
        onSearchClick={() => setIsSearchOpen(true)} 
        onSubscribeClick={() => setIsSubscribeOpen(true)} 
      />
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 md:py-12 grow">
        <Breadcrumbs />
        {children}
      </main>
      
      <Footer />

      {/* 4. Render Modals (They live outside the main flow) */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <SubscribeModal 
        isOpen={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
      />
    </div>
  );
}