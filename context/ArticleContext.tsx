'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Article {
  id: number | string;
  title: string;
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

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

interface RawArticle {
  id: number | string;
  title: string;
  category: string | { name: string; href: string };
  author_name: string;
  summary: string;
}

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data: RawArticle[] = await response.json();
        setArticles(data.map((a: RawArticle) => ({
          ...a,
          id: String(a.id), // Ensure IDs are always strings internally
          author: a.author_name || 'Admin',
          status: 'Published',
          // Normalization logic:
          category: typeof a.category === 'string' 
            ? { name: a.category, href: '#' } 
            : a.category
        })) as Article[]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticles();
  }, []);

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
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};