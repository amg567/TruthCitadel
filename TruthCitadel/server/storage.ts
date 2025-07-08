import {
  users,
  contentEntries,
  reminders,
  userStats,
  activityLog,
  integrations,
  type User,
  type UpsertUser,
  type ContentEntry,
  type InsertContentEntry,
  type Reminder,
  type InsertReminder,
  type UserStats,
  type InsertUserStats,
  type ActivityLog,
  type InsertActivityLog,
  type Integration,
  type InsertIntegration,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllContentEntries(): Promise<ContentEntry[]>;
  getAllReminders(): Promise<Reminder[]>;
  getAllActivities(): Promise<ActivityLog[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  getSystemStats(): Promise<{
    totalUsers: number;
    totalContent: number;
    totalReminders: number;
    totalActivities: number;
    subscriptionBreakdown: { status: string; count: number }[];
  }>;
  
  // Content operations
  getUserContentEntries(userId: string, category?: string): Promise<ContentEntry[]>;
  createContentEntry(entry: InsertContentEntry): Promise<ContentEntry>;
  updateContentEntry(id: number, entry: Partial<InsertContentEntry>): Promise<ContentEntry>;
  deleteContentEntry(id: number): Promise<void>;
  
  // Reminder operations
  getUserReminders(userId: string): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
  
  // Statistics operations
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats>;
  
  // Activity operations
  getUserActivity(userId: string, limit?: number): Promise<ActivityLog[]>;
  createActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  
  // Integration operations
  getUserIntegrations(userId: string): Promise<Integration[]>;
  upsertIntegration(integration: InsertIntegration): Promise<Integration>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: "premium",
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserContentEntries(userId: string, category?: string): Promise<ContentEntry[]> {
    const conditions = [eq(contentEntries.userId, userId)];
    if (category) {
      conditions.push(eq(contentEntries.category, category));
    }
    
    return await db
      .select()
      .from(contentEntries)
      .where(and(...conditions))
      .orderBy(desc(contentEntries.createdAt));
  }

  async createContentEntry(entry: InsertContentEntry): Promise<ContentEntry> {
    const [newEntry] = await db
      .insert(contentEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async updateContentEntry(id: number, entry: Partial<InsertContentEntry>): Promise<ContentEntry> {
    const [updatedEntry] = await db
      .update(contentEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(contentEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteContentEntry(id: number): Promise<void> {
    await db.delete(contentEntries).where(eq(contentEntries.id, id));
  }

  async getUserReminders(userId: string): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, userId))
      .orderBy(reminders.dueDate);
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const [newReminder] = await db
      .insert(reminders)
      .values(reminder)
      .returning();
    return newReminder;
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder> {
    const [updatedReminder] = await db
      .update(reminders)
      .set({ ...reminder, updatedAt: new Date() })
      .where(eq(reminders.id, id))
      .returning();
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<void> {
    await db.delete(reminders).where(eq(reminders.id, id));
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = await this.getUserStats(userId);
    
    if (existing) {
      const [updatedStats] = await db
        .update(userStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(userStats.userId, userId))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(userStats)
        .values({ userId, ...stats })
        .returning();
      return newStats;
    }
  }

  async getUserActivity(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLog)
      .where(eq(activityLog.userId, userId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  async createActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const [newActivity] = await db
      .insert(activityLog)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getUserIntegrations(userId: string): Promise<Integration[]> {
    return await db
      .select()
      .from(integrations)
      .where(eq(integrations.userId, userId));
  }

  async upsertIntegration(integration: InsertIntegration): Promise<Integration> {
    const [result] = await db
      .insert(integrations)
      .values(integration)
      .onConflictDoUpdate({
        target: [integrations.userId, integrations.platform],
        set: {
          isConnected: integration.isConnected,
          settings: integration.settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getAllContentEntries(): Promise<ContentEntry[]> {
    return await db
      .select()
      .from(contentEntries)
      .orderBy(desc(contentEntries.createdAt));
  }

  async getAllReminders(): Promise<Reminder[]> {
    return await db
      .select()
      .from(reminders)
      .orderBy(desc(reminders.createdAt));
  }

  async getAllActivities(): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete user's content, reminders, stats, and activities first
    await db.delete(contentEntries).where(eq(contentEntries.userId, userId));
    await db.delete(reminders).where(eq(reminders.userId, userId));
    await db.delete(userStats).where(eq(userStats.userId, userId));
    await db.delete(activityLog).where(eq(activityLog.userId, userId));
    await db.delete(integrations).where(eq(integrations.userId, userId));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalContent: number;
    totalReminders: number;
    totalActivities: number;
    subscriptionBreakdown: { status: string; count: number }[];
  }> {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    
    const [contentCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contentEntries);
    
    const [reminderCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reminders);
    
    const [activityCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityLog);
    
    const subscriptionBreakdown = await db
      .select({
        status: users.subscriptionStatus,
        count: sql<number>`count(*)`
      })
      .from(users)
      .groupBy(users.subscriptionStatus);

    return {
      totalUsers: userCount?.count || 0,
      totalContent: contentCount?.count || 0,
      totalReminders: reminderCount?.count || 0,
      totalActivities: activityCount?.count || 0,
      subscriptionBreakdown: subscriptionBreakdown || [],
    };
  }
}

export const storage = new DatabaseStorage();
