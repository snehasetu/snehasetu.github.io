import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from './db';
import { users, oahProfiles, needs } from '../shared/schema';
import { type User, type OAHProfile, type Need } from '../shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserBySupabaseId(supabaseId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  listUsers(): Promise<User[]>;
  // OAH profiles
  createOAHProfile(data: Partial<OAHProfile> & { userId: string }): Promise<OAHProfile>;
  getOAHProfileById(id: string): Promise<OAHProfile | undefined>;
  getOAHProfileByUserId(userId: string): Promise<OAHProfile | undefined>;
  listOAHProfiles(): Promise<OAHProfile[]>;
  updateOAHProfile(id: string, updates: Partial<OAHProfile>): Promise<OAHProfile>;
  // Needs
  createNeed(data: Partial<Need> & { oahId: string }): Promise<Need>;
  getNeedById(id: string): Promise<Need | undefined>;
  listNeedsByOahId(oahId: string): Promise<Need[]>;
  listNeeds(filters?: { oahId?: string; status?: string }): Promise<Need[]>;
  updateNeed(id: string, updates: Partial<Need>): Promise<Need>;
  countActiveNeedsByOahId(oahId: string): Promise<number>;
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

  async createOAHProfile(data: Partial<OAHProfile> & { userId: string }): Promise<OAHProfile> {
    const id = randomUUID();
    const row = {
      id,
      userId: data.userId,
      name: data.name ?? '',
      description: data.description ?? null,
      location: data.location ?? '',
      contactPerson: data.contactPerson ?? '',
      contactEmail: data.contactEmail ?? '',
      contactPhone: data.contactPhone ?? '',
      streetAddress: data.streetAddress ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      verified: data.verified ?? false,
      yearsEstablished: data.yearsEstablished ?? null,
      imageUrl: data.imageUrl ?? null,
      createdAt: new Date(),
    };
    await db.insert(oahProfiles).values(row);
    return row as OAHProfile;
  }

  async getOAHProfileById(id: string): Promise<OAHProfile | undefined> {
    const r = await db.select().from(oahProfiles).where(eq(oahProfiles.id, id)).limit(1);
    return r[0];
  }

  async getOAHProfileByUserId(userId: string): Promise<OAHProfile | undefined> {
    const r = await db.select().from(oahProfiles).where(eq(oahProfiles.userId, userId)).limit(1);
    return r[0];
  }

  async listOAHProfiles(): Promise<OAHProfile[]> {
    return db.select().from(oahProfiles).orderBy(desc(oahProfiles.createdAt));
  }

  async updateOAHProfile(id: string, updates: Partial<OAHProfile>): Promise<OAHProfile> {
    await db.update(oahProfiles).set(updates).where(eq(oahProfiles.id, id));
    const updated = await this.getOAHProfileById(id);
    if (!updated) throw new Error('OAH profile not found after update');
    return updated;
  }

  async createNeed(data: Partial<Need> & { oahId: string }): Promise<Need> {
    const id = randomUUID();
    const row = {
      id,
      oahId: data.oahId,
      type: data.type ?? 'material',
      title: data.title ?? '',
      description: data.description ?? '',
      status: data.status ?? 'active',
      quantity: data.quantity ?? null,
      targetAmount: data.targetAmount ?? null,
      raisedAmount: data.raisedAmount ?? 0,
      eventDate: data.eventDate ?? null,
      location: data.location ?? null,
      imageUrl: data.imageUrl ?? null,
      createdAt: new Date(),
    };
    await db.insert(needs).values(row);
    return row as Need;
  }

  async getNeedById(id: string): Promise<Need | undefined> {
    const r = await db.select().from(needs).where(eq(needs.id, id)).limit(1);
    return r[0];
  }

  async listNeedsByOahId(oahId: string): Promise<Need[]> {
    return db.select().from(needs).where(eq(needs.oahId, oahId)).orderBy(desc(needs.createdAt));
  }

  async listNeeds(filters?: { oahId?: string; status?: string }): Promise<Need[]> {
    const conditions = [];
    if (filters?.oahId) conditions.push(eq(needs.oahId, filters.oahId));
    if (filters?.status) conditions.push(eq(needs.status, filters.status));
    if (conditions.length) {
      return db.select().from(needs).where(and(...conditions)).orderBy(desc(needs.createdAt));
    }
    return db.select().from(needs).orderBy(desc(needs.createdAt));
  }

  async updateNeed(id: string, updates: Partial<Need>): Promise<Need> {
    await db.update(needs).set(updates).where(eq(needs.id, id));
    const updated = await this.getNeedById(id);
    if (!updated) throw new Error('Need not found after update');
    return updated;
  }

  async countActiveNeedsByOahId(oahId: string): Promise<number> {
    const r = await db.select({ count: sql<number>`count(*)` }).from(needs).where(and(eq(needs.oahId, oahId), eq(needs.status, 'active')));
    return Number(r[0]?.count ?? 0);
  }
}

export const storage = new DrizzleStorage();
