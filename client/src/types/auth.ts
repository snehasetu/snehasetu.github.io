export type UserRole = 'volunteer' | 'oah' | 'admin';

export interface AppUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatarUrl: string | null;
  approved: boolean;
  createdAt: string;
}
