import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Administrator',
    email: 'admin@psda.lampung.go.id',
    role: 'admin',
  },
  field_officer: {
    id: '2',
    name: 'Petugas Lapangan',
    email: 'petugas@psda.lampung.go.id',
    role: 'field_officer',
  },
  manager: {
    id: '3',
    name: 'Kepala Bidang',
    email: 'manager@psda.lampung.go.id',
    role: 'manager',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password.length >= 4) {
      setUser(mockUsers[role]);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
