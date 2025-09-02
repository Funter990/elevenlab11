import { type User, type InsertUser, type VoiceGeneration, type InsertVoiceGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVoiceGeneration(id: string): Promise<VoiceGeneration | undefined>;
  createVoiceGeneration(generation: InsertVoiceGeneration): Promise<VoiceGeneration>;
  getVoiceGenerationsByUser(userId: string): Promise<VoiceGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private voiceGenerations: Map<string, VoiceGeneration>;

  constructor() {
    this.users = new Map();
    this.voiceGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVoiceGeneration(id: string): Promise<VoiceGeneration | undefined> {
    return this.voiceGenerations.get(id);
  }

  async createVoiceGeneration(insertGeneration: InsertVoiceGeneration): Promise<VoiceGeneration> {
    const id = randomUUID();
    const generation: VoiceGeneration = {
      ...insertGeneration,
      id,
      createdAt: new Date(),
    };
    this.voiceGenerations.set(id, generation);
    return generation;
  }

  async getVoiceGenerationsByUser(userId: string): Promise<VoiceGeneration[]> {
    return Array.from(this.voiceGenerations.values())
      .filter((gen) => gen.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
