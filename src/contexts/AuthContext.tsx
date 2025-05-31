import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // Type-only import for ReactNode
// AuthServiceInterface import removed as it might be unused if authService type is inferred
import authService, { /* type AuthServiceInterface, */ type User } from '../services/authService';

// Interface AuthContextType needs to be updated to use the User from authService
export interface AuthContextType { // Ensure AuthContextType is exported
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Make logout async
  signup: (email: string, password: string) => Promise<void>; // Add password to signup
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true to check initial auth status
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for current user when the app loads
    const checkCurrentUser = async () => {
      setIsLoading(true);
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        // Handle error if needed, though mock getCurrentUser doesn't throw
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      setError(null); // Clear any previous errors on successful login
    } catch (err) {
      setCurrentUser(null);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => { // Make logout async
    setIsLoading(true);
    setError(null);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during logout');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => { // Add password to signup
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.signup(email, password);
      setCurrentUser(user);
      setError(null); // Clear any previous errors on successful signup
    } catch (err) {
      setCurrentUser(null);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
