// components/modals/SearchModal.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FEATURED_ARTICLE, TRENDING_ARTICLES, LATEST_ARTICLES } from '../../constants/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const lng = (router.query.lng as string) || 'en';

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  if (!isOpen) return null;

  // Article type definition
  interface Article {
    id: string | number;
    title: string;
    excerpt?: string;
    category?: { name?: string };
    href?: string;
    slug?: string;
  }

  // Combine all data for searching
  const allArticles: Article[] = [FEATURED_ARTICLE, ...TRENDING_ARTICLES, ...LATEST_ARTICLES];

  // Filter logic
  const results = query.length < 2 ? [] : allArticles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    (typeof article.excerpt === 'string' && article.excerpt.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl overflow-hidden">
        
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-200 p-4">
          <svg className="w-6 h-6 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search news, analysis, and reports..."
            className="flex-1 text-xl font-serif font-bold text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-700"
            title="Close search"
            aria-label="Close search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.map((article: Article) => (
            <Link 
              key={article.id} 
              href={article.href || (article.slug ? `/${lng}/articles/${article.slug}` : '#')}
              onClick={onClose}
              className="block p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1 block">
                {article.category?.name || 'News'}
              </span>
              <h4 className="text-lg font-serif font-bold text-slate-900 group-hover:text-red-700">
                {article.title}
              </h4>
            </Link>
          ))}
          
          {query.length === 0 && (
             <div className="p-4">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Topics</h4>
               <div className="flex flex-wrap gap-2">
                 {['Minembwe', 'M23', 'Humanitarian', 'Goma'].map(tag => (
                   <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-sm hover:bg-slate-300">
                     {tag}
                   </button>
                 ))}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}