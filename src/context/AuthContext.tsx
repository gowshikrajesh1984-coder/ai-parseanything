import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr-sarah-jenkins',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@acmecorp.ai',
  role: 'Lead AI Document Analyst',
  plan: 'Enterprise Pro',
  avatarUrl: '/src/assets/images/avatar_profile_user_1791377545598.jpg',
};

const STORAGE_KEY = 'parseanything_auth_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAuthenticated = Boolean(currentUser);

  const login = useCallback(
    async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      // Simulate network request to authentication API endpoint
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);

          // Mock credential check
          if (!email || !email.includes('@')) {
            resolve({ success: false, error: 'Enter a valid email address.' });
            return;
          }

          if (!password || password.length < 8) {
            resolve({ success: false, error: 'Password must contain at least 8 characters.' });
            return;
          }

          const user: User = {
            id: `usr-${Date.now()}`,
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Sarah Jenkins',
            email: email.toLowerCase(),
            role: 'Document Intelligence Analyst',
            plan: 'Enterprise Plan',
            avatarUrl: '/src/assets/images/avatar_profile_user_1791377545598.jpg',
          };

          setCurrentUser(user);

          try {
            if (rememberMe) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } else {
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            }
          } catch {
            // ignore
          }

          resolve({ success: true });
        }, 800);
      });
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);

          if (!name || name.trim().length < 2) {
            resolve({ success: false, error: 'Full name is required.' });
            return;
          }

          if (!email || !email.includes('@')) {
            resolve({ success: false, error: 'Enter a valid email address.' });
            return;
          }

          if (!password || password.length < 8) {
            resolve({ success: false, error: 'Password must contain at least 8 characters.' });
            return;
          }

          const user: User = {
            id: `usr-${Date.now()}`,
            name: name.trim(),
            email: email.toLowerCase(),
            role: 'Document Intelligence Analyst',
            plan: 'Standard Plan',
            avatarUrl: '/src/assets/images/avatar_profile_user_1791377545598.jpg',
          };

          setCurrentUser(user);
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          } catch {
            // ignore
          }

          resolve({ success: true });
        }, 800);
      });
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
