import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from '../shared/schema';
import { type User } from '../shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserBySupabaseId(supabaseId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
}

export class DrizzleStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserBySupabaseId(supabaseId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.supabaseId, supabaseId)).limit(1);
    return result[0];
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const id = randomUUID();
    const newUser = {
      id,
      supabaseId: userData.supabaseId!,
      role: userData.role || 'volunteer',
      name: userData.name || '',
      email: userData.email || '',
      avatarUrl: userData.avatarUrl || null,
      approved: userData.approved ?? true,
      createdAt: new Date(),
    };
    await db.insert(users).values(newUser);
    return newUser as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await db.update(users).set(updates).where(eq(users.id, id));
    const updated = await this.getUserById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }
}

export const storage = new DrizzleStorage();
