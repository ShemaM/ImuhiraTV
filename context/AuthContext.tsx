'use client'; // <--- 1. Required for any file using hooks (useState, createContext)

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // <--- 2. Updated import for App Router

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('news_user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [isLoading] = useState(false);
  const router = useRouter();

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('news_user', JSON.stringify(userData));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('news_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};