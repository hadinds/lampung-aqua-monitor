import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Context for authentication state management

export interface StoredUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  users: StoredUser[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserCredentials: (userId: string, newUsername?: string, newPassword?: string) => Promise<{ success: boolean; error?: string }>;
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

export function AuthProvider({ children }: { children: ReactNode }) {
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
        username: foundUser.username,
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

  const updateUserCredentials = useCallback(async (
    userId: string,
    newUsername?: string,
    newPassword?: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Only admin can update credentials
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Hanya admin yang dapat mengubah kredensial' };
    }

    // Find target user
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, error: 'User tidak ditemukan' };
    }

    // Check if new username already exists (if changing username)
    if (newUsername && newUsername !== targetUser.username) {
      const usernameExists = users.some(
        u => u.username === newUsername && u.id !== userId
      );
      if (usernameExists) {
        return { success: false, error: 'Username sudah digunakan' };
      }
    }

    // Update credentials
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          username: newUsername || u.username,
          password: newPassword || u.password,
        };
      }
      return u;
    });

    setUsers(updatedUsers);

    // If admin is updating their own credentials, update the session
    if (userId === user.id && newUsername) {
      setUser(prev => prev ? {
        ...prev,
        username: newUsername,
        email: `${newUsername}@psda.lampung.go.id`,
      } : null);
    }

    return { success: true };
  }, [user, users]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, users, login, logout, updateUserCredentials }}>
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
