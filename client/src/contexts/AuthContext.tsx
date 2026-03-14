import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppUser } from '@/types/auth';

const TOKEN_KEY = 'snehasetu_token';
const getApiBase = () => import.meta.env.VITE_API_URL || '';

export interface OAHProfileInput {
  homeName: string;
  description?: string;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  yearsEstablished?: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'volunteer' | 'oah', oahProfile?: OAHProfileInput) => Promise<void>;
  logout: () => void;
  setUser: (u: AppUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserState({
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        });
      } else {
        clearToken();
        setUserState(null);
      }
    } catch {
      clearToken();
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const base = getApiBase();
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    storeToken(data.token);
    setUserState({
      ...data.user,
      createdAt: data.user?.createdAt ? new Date(data.user.createdAt).toISOString() : new Date().toISOString(),
    });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: 'volunteer' | 'oah', oahProfile?: OAHProfileInput) => {
    const base = getApiBase();
    const res = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role, ...(role === 'oah' && oahProfile && { oahProfile }) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    storeToken(data.token);
    setUserState({
      ...data.user,
      createdAt: data.user?.createdAt ? new Date(data.user.createdAt).toISOString() : new Date().toISOString(),
    });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUserState(null);
  }, []);

  const setUser = useCallback((u: AppUser | null) => {
    setUserState(u);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
