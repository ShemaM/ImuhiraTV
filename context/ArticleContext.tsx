import { createContext, useContext, useState, ReactNode } from 'react';
import { LATEST_ARTICLES as INITIAL_DATA } from '../constants/mockData';

// Define the shape of an Article
export interface Article {
  id: number | string;
  title: string;
  category: string | { name: string; href: string };
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

const ArticleContext = createContext<ArticleContextType>({} as ArticleContextType);

export function ArticleProvider({ children }: { children: ReactNode }) {
  // Initialize state with your mock data
  const [articles, setArticles] = useState<Article[]>(INITIAL_DATA.map(a => ({
    ...a,
    // Normalize mock data structure to match our interface
    author: a.author_name || 'Admin', 
    status: 'Published' // Default mock items to Published
  })));

  // 1. ADD
  const addArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  // 2. UPDATE
  const updateArticle = (id: string | number, updatedData: Partial<Article>) => {
    setArticles(prev => prev.map(article => 
      String(article.id) === String(id) ? { ...article, ...updatedData } : article
    ));
  };

  // 3. DELETE
  const deleteArticle = (id: string | number) => {
    setArticles(prev => prev.filter(article => String(article.id) !== String(id)));
  };

  return (
    <ArticleContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle }}>
      {children}
    </ArticleContext.Provider>
  );
}

export const useArticles = () => useContext(ArticleContext);