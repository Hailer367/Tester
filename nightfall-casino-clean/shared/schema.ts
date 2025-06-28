import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(),
  avatar: text("avatar").notNull().default("U"),
  profileColor: text("profile_color").notNull().default("purple"),
  solBalance: decimal("sol_balance", { precision: 18, scale: 9 }).default("0"),
  totalWagered: decimal("total_wagered", { precision: 18, scale: 9 }).default("0"),
  totalWon: decimal("total_won", { precision: 18, scale: 9 }).default("0"),
  currentStreak: integer("current_streak").default(0),
  maxStreak: integer("max_streak").default(0),
  lastActivity: timestamp("last_activity").defaultNow(),
  isOnline: boolean("is_online").default(false),
  isAdmin: boolean("is_admin").default(false),
  isBanned: boolean("is_banned").default(false),
  isMuted: boolean("is_muted").default(false),
  vouchPercentage: decimal("vouch_percentage", { precision: 5, scale: 2 }).default("0"),
  activeGames: integer("active_games").default(0),
  playerTitle: text("player_title"),
  soundPack: text("sound_pack").default("night_ambience"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameSettings = pgTable("game_settings", {
  id: serial("id").primaryKey(),
  gameType: text("game_type").notNull().unique(),
  houseEdge: decimal("house_edge", { precision: 5, scale: 2 }).default("1.5"),
  playingFee: decimal("playing_fee", { precision: 5, scale: 2 }).default("2.0"),
  isEnabled: boolean("is_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feeWallets = pgTable("fee_wallets", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  walletName: text("wallet_name").notNull(),
  isActive: boolean("is_active").default(true),
  gameTypes: text("game_types").array().default([]),
  totalCollected: decimal("total_collected", { precision: 18, scale: 9 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminWallet: text("admin_wallet").notNull(),
  action: text("action").notNull(),
  targetUser: text("target_user"),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(),
  betAmount: decimal("bet_amount", { precision: 18, scale: 9 }).notNull(),
  winAmount: decimal("win_amount", { precision: 18, scale: 9 }).default("0"),
  isWin: boolean("is_win").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const gameRooms = pgTable("game_rooms", {
  id: serial("id").primaryKey(),
  gameType: text("game_type").notNull(),
  roomName: text("room_name").notNull(),
  hostUserId: integer("host_user_id").references(() => users.id).notNull(),
  maxPlayers: integer("max_players").default(2),
  currentPlayers: integer("current_players").default(1),
  betAmount: decimal("bet_amount", { precision: 18, scale: 9 }).notNull(),
  status: text("status").default("waiting"), // waiting, playing, finished
  gameData: text("game_data"), // JSON string for game state
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gameParticipants = pgTable("game_participants", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").references(() => gameRooms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  position: integer("position"), // for games like snake & ladder
  isWinner: boolean("is_winner").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  walletAddress: true,
  avatar: true,
  profileColor: true,
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).pick({
  settingKey: true,
  settingValue: true,
});

export const insertGameSettingSchema = createInsertSchema(gameSettings).pick({
  gameType: true,
  houseEdge: true,
  playingFee: true,
  isEnabled: true,
});

export const insertFeeWalletSchema = createInsertSchema(feeWallets).pick({
  walletAddress: true,
  walletName: true,
  gameTypes: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  adminWallet: true,
  action: true,
  targetUser: true,
  details: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  username: true,
  message: true,
});

export const insertGameStatsSchema = createInsertSchema(gameStats).pick({
  userId: true,
  gameType: true,
  betAmount: true,
  winAmount: true,
  isWin: true,
});

export const insertGameRoomSchema = createInsertSchema(gameRooms).pick({
  gameType: true,
  roomName: true,
  hostUserId: true,
  maxPlayers: true,
  betAmount: true,
});

export const insertGameParticipantSchema = createInsertSchema(gameParticipants).pick({
  roomId: true,
  userId: true,
  position: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertGameStats = z.infer<typeof insertGameStatsSchema>;
export type GameStats = typeof gameStats.$inferSelect;
export type InsertGameRoom = z.infer<typeof insertGameRoomSchema>;
export type GameRoom = typeof gameRooms.$inferSelect;
export type InsertGameParticipant = z.infer<typeof insertGameParticipantSchema>;
export type GameParticipant = typeof gameParticipants.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertGameSetting = z.infer<typeof insertGameSettingSchema>;
export type GameSetting = typeof gameSettings.$inferSelect;
export type InsertFeeWallet = z.infer<typeof insertFeeWalletSchema>;
export type FeeWallet = typeof feeWallets.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
