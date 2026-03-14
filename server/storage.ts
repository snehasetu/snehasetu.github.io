import { eq, desc } from 'drizzle-orm';
import { db } from './db';
import { users } from '../shared/schema';
import { type User } from '../shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserBySupabaseId(supabaseId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  listUsers(): Promise<User[]>;
}

export class DrizzleStorage implements IStorage {
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
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
      supabaseId: userData.supabaseId ?? null,
      passwordHash: userData.passwordHash ?? null,
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
    const { passwordHash, ...rest } = updates as Partial<User> & { passwordHash?: string | null };
    const set: Record<string, unknown> = { ...rest };
    if (passwordHash !== undefined) set.passwordHash = passwordHash;
    await db.update(users).set(set as Partial<User>).where(eq(users.id, id));
    const updated = await this.getUserById(id);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  async listUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }
}

export const storage = new DrizzleStorage();
