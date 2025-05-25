import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions
interface User {
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  signup: (email, password) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    // Mock login
    if (email === 'test@example.com' && password === 'password') {
      setCurrentUser({ email });
    } else {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    // Mock signup - always succeeds for now
    setCurrentUser({ email });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
