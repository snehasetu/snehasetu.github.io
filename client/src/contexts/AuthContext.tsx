import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, type AppUser } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

const getApiBase = () => import.meta.env.VITE_API_URL || '';

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const normalizeAppUser = (raw: Record<string, unknown>): AppUser => ({
    id: raw.id as string,
    supabaseId: raw.supabaseId as string,
    role: raw.role as AppUser['role'],
    name: raw.name as string,
    email: raw.email as string,
    avatarUrl: (raw.avatarUrl as string) ?? null,
    approved: Boolean(raw.approved),
    createdAt: raw.createdAt ? new Date(raw.createdAt as string) : new Date(),
  });

  const fetchAppUser = async (supabaseId: string) => {
    try {
      const base = getApiBase();
      const response = await fetch(`${base}/api/users/by-supabase/${supabaseId}`);
      if (response.ok) {
        const raw = await response.json();
        setUser(normalizeAppUser(raw));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching app user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    supabaseUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
