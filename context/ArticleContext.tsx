'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { LATEST_ARTICLES as INITIAL_DATA } from '../constants/mockData';

export interface Article {
  id: number | string;
  title: string;
  // IMPACT: Normalize this to always be an object so UI code is cleaner
  category: { name: string; href: string }; 
  author: string;
  status: 'Published' | 'Draft';
  content?: string;
  published_at?: string;
}

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string | number, updatedData: Partial<Article>) => void;
  deleteArticle: (id: string | number) => void;
}

// IMPACT: Set default to undefined to force a safety check later
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(() => {
    // We use a callback here so this expensive mapping only runs once on mount
    return INITIAL_DATA.map(a => ({
      ...a,
      id: String(a.id), // Ensure IDs are always strings internally
      author: a.author_name || 'Admin',
      status: 'Published',
      // Normalization logic:
      category: typeof a.category === 'string' 
        ? { name: a.category, href: '#' } 
        : a.category
    })) as Article[];
  });

  const addArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string | number, updatedData: Partial<Article>) => {
    setArticles(prev => prev.map(article => 
      article.id === String(id) ? { ...article, ...updatedData } : article
    ));
  };

  const deleteArticle = (id: string | number) => {
    setArticles(prev => prev.filter(article => article.id !== String(id)));
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle }}>
      {children}
    </ArticleContext.Provider>
  );
}

export const useArticles = () => {
  const context = useContext(ArticleContext);
  // IMPACT: Fast fail if used incorrectly
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};