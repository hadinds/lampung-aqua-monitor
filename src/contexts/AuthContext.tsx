import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface StoredUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername?: string, newPassword?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: StoredUser[] = [
  {
    id: '1',
    name: 'Administrator',
    username: 'admin',
    password: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Petugas Lapangan',
    username: 'petugas',
    password: 'petugas',
    role: 'field_officer',
  },
  {
    id: '3',
    name: 'Kepala Dinas',
    username: 'kadis',
    password: 'Kadis',
    role: 'manager',
  },
];

const STORAGE_KEY = 'simoni_users';

function getStoredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading stored users:', e);
  }
  // Initialize with default users
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<StoredUser[]>(getStoredUsers);

  // Sync users to localStorage whenever they change
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: `${foundUser.username}@psda.lampung.go.id`,
        role: foundUser.role,
      });
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateCredentials = useCallback(async (
    currentPassword: string,
    newUsername?: string,
    newPassword?: string
  ): Promise<boolean> => {
    if (!user) return false;

    // Find current user and verify password
    const currentUserData = users.find(u => u.id === user.id);
    if (!currentUserData || currentUserData.password !== currentPassword) {
      return false;
    }

    // Check if new username already exists (if changing username)
    if (newUsername && newUsername !== currentUserData.username) {
      const usernameExists = users.some(
        u => u.username === newUsername && u.id !== user.id
      );
      if (usernameExists) {
        return false;
      }
    }

    // Update credentials
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          username: newUsername || u.username,
          password: newPassword || u.password,
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    // Update current user email display
    if (newUsername) {
      setUser(prev => prev ? {
        ...prev,
        email: `${newUsername}@psda.lampung.go.id`,
      } : null);
    }

    return true;
  }, [user, users]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateCredentials }}>
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
