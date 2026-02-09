import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo credentials
    if (email === 'admin@hotel.com' && password === 'admin') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@hotel.com',
        role: 'admin'
      });
      return true;
    } else if (password.length >= 6) {
      setUser({
        id: '2',
        name: email.split('@')[0],
        email: email,
        role: 'customer'
      });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (name && email && password.length >= 6) {
      setUser({
        id: Date.now().toString(),
        name: name,
        email: email,
        role: 'customer'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
