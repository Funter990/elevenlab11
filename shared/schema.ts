import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const voiceGenerations = pgTable("voice_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  script: text("script").notNull(),
  voiceId: text("voice_id").notNull(),
  model: text("model").notNull(),
  settings: jsonb("settings").notNull(),
  audioUrl: text("audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVoiceGenerationSchema = createInsertSchema(voiceGenerations).omit({
  id: true,
  createdAt: true,
});

export const voiceSettingsSchema = z.object({
  stability: z.number().min(0).max(100),
  similarity: z.number().min(0).max(100),
  styleExaggeration: z.number().min(0).max(100),
  speed: z.number().min(0.25).max(2.0),
});

export const generateVoiceSchema = z.object({
  script: z.string().min(1).max(10000),
  apiKey: z.string().min(1),
  voiceId: z.string().min(1),
  model: z.enum(['eleven_multilingual_v2', 'eleven_flash_v2_5', 'eleven_v3', 'eleven_turbo_v2_5']),
  settings: voiceSettingsSchema,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVoiceGeneration = z.infer<typeof insertVoiceGenerationSchema>;
export type VoiceGeneration = typeof voiceGenerations.$inferSelect;
export type VoiceSettings = z.infer<typeof voiceSettingsSchema>;
export type GenerateVoiceRequest = z.infer<typeof generateVoiceSchema>;
