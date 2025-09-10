'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('payflow_token');
      const storedUser = localStorage.getItem('payflow_user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          useAuthStore.setState({
            user: userData,
            token: storedToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout, setLoading]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}