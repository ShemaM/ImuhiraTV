import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

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

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Initialize from localStorage safely using a lazy initializer (avoids setState inside effect)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('news_user');
    return storedUser ? JSON.parse(storedUser) : null;
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

export const useAuth = () => useContext(AuthContext);