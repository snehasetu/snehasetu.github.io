import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  supabaseId: varchar("supabase_id").unique(), // optional; used only if migrating from Supabase auth
  passwordHash: text("password_hash"), // for email/password login
  role: varchar("role").notNull(), // 'volunteer' | 'oah' | 'admin'
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  approved: boolean("approved").default(true), // OAH users need approval, volunteers auto-approved
  createdAt: timestamp("created_at").defaultNow(),
});

export const oahProfiles = pgTable("oah_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  contactPerson: text("contact_person").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  verified: boolean("verified").default(false),
  yearsEstablished: integer("years_established"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const needs = pgTable("needs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oahId: varchar("oah_id").notNull(),
  type: varchar("type").notNull(), // 'urgent' | 'material' | 'volunteer' | 'campaign'
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default('active'), // 'active' | 'fulfilled'
  quantity: text("quantity"),
  targetAmount: integer("target_amount"),
  raisedAmount: integer("raised_amount").default(0),
  eventDate: text("event_date"),
  location: text("location"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const volunteerResponses = pgTable("volunteer_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  needId: varchar("need_id").notNull(),
  userId: varchar("user_id").notNull(),
  responseType: varchar("response_type").notNull(),
  amount: integer("amount"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertOAHProfileSchema = createInsertSchema(oahProfiles).omit({
  id: true,
  userId: true,
  verified: true,
  createdAt: true,
});

export const insertNeedSchema = createInsertSchema(needs).omit({
  id: true,
  createdAt: true,
  raisedAmount: true,
});

export const insertVolunteerResponseSchema = createInsertSchema(volunteerResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOAHProfile = z.infer<typeof insertOAHProfileSchema>;
export type OAHProfile = typeof oahProfiles.$inferSelect;
export type InsertNeed = z.infer<typeof insertNeedSchema>;
export type Need = typeof needs.$inferSelect;
export type InsertVolunteerResponse = z.infer<typeof insertVolunteerResponseSchema>;
export type VolunteerResponse = typeof volunteerResponses.$inferSelect;
