import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are set
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type UserRole = 'volunteer' | 'oah';

export interface AppUser {
  id: string;
  supabaseId: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl: string | null;
  approved: boolean;
  createdAt: Date;
}
