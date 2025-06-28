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

export const shopItems = pgTable("shop_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // titles, borders, sounds, effects, coins, backgrounds, achievements
  description: text("description").notNull(),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary, celestial
  priceInSOL: decimal("price_in_sol", { precision: 18, scale: 9 }).default("0"),
  unlockCondition: text("unlock_condition"), // JSON string with unlock requirements
  isUnlockable: boolean("is_unlockable").default(true),
  isPurchasable: boolean("is_purchasable").default(false),
  previewUrl: text("preview_url"),
  isHidden: boolean("is_hidden").default(false),
  isSeasonal: boolean("is_seasonal").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userInventory = pgTable("user_inventory", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").references(() => shopItems.id).notNull(),
  status: text("status").notNull().default("owned"), // owned, unlocked, purchased, equipped
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const purchaseLogs = pgTable("purchase_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").references(() => shopItems.id).notNull(),
  amountSOL: decimal("amount_sol", { precision: 18, scale: 9 }).notNull(),
  txHash: text("tx_hash"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const collectorBots = pgTable("collector_bots", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  profilePicture: text("profile_picture").notNull(),
  walletPrivateKey: text("wallet_private_key").notNull(), // encrypted
  allowedGames: text("allowed_games").array().notNull(),
  winProbability: decimal("win_probability", { precision: 5, scale: 2 }).notNull(),
  gameInterval: integer("game_interval").notNull(), // minutes between games
  canPlayMultiple: boolean("can_play_multiple").default(false),
  minStakeSOL: decimal("min_stake_sol", { precision: 18, scale: 9 }).notNull(),
  maxStakeSOL: decimal("max_stake_sol", { precision: 18, scale: 9 }).notNull(),
  canBuyShopItems: boolean("can_buy_shop_items").default(false),
  allowedShopItems: text("allowed_shop_items").array().default([]),
  ghostMode: boolean("ghost_mode").default(false),
  botType: text("bot_type").notNull().default("COLLECTOR"), // COLLECTOR, MILE_COLLECTOR
  isActive: boolean("is_active").default(false),
  activeSchedule: text("active_schedule"), // JSON string with time ranges
  createdBy: text("created_by").notNull(), // admin wallet
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameStatuses = pgTable("game_statuses", {
  id: serial("id").primaryKey(),
  gameType: text("game_type").notNull().unique(),
  isLocked: boolean("is_locked").default(false),
  lockReason: text("lock_reason"),
  lockedBy: text("locked_by"), // admin wallet
  lockedAt: timestamp("locked_at"),
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

export const insertShopItemSchema = createInsertSchema(shopItems).pick({
  name: true,
  category: true,
  description: true,
  rarity: true,
  priceInSOL: true,
  unlockCondition: true,
  isUnlockable: true,
  isPurchasable: true,
  previewUrl: true,
  isHidden: true,
  isSeasonal: true,
});

export const insertUserInventorySchema = createInsertSchema(userInventory).pick({
  userId: true,
  itemId: true,
  status: true,
});

export const insertPurchaseLogSchema = createInsertSchema(purchaseLogs).pick({
  userId: true,
  itemId: true,
  amountSOL: true,
  txHash: true,
});

export const insertCollectorBotSchema = createInsertSchema(collectorBots).pick({
  username: true,
  profilePicture: true,
  walletPrivateKey: true,
  allowedGames: true,
  winProbability: true,
  gameInterval: true,
  canPlayMultiple: true,
  minStakeSOL: true,
  maxStakeSOL: true,
  canBuyShopItems: true,
  allowedShopItems: true,
  ghostMode: true,
  botType: true,
  activeSchedule: true,
  createdBy: true,
});

export const insertGameStatusSchema = createInsertSchema(gameStatuses).pick({
  gameType: true,
  isLocked: true,
  lockReason: true,
  lockedBy: true,
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
export type InsertShopItem = z.infer<typeof insertShopItemSchema>;
export type ShopItem = typeof shopItems.$inferSelect;
export type InsertUserInventory = z.infer<typeof insertUserInventorySchema>;
export type UserInventory = typeof userInventory.$inferSelect;
export type InsertPurchaseLog = z.infer<typeof insertPurchaseLogSchema>;
export type PurchaseLog = typeof purchaseLogs.$inferSelect;
export type InsertCollectorBot = z.infer<typeof insertCollectorBotSchema>;
export type CollectorBot = typeof collectorBots.$inferSelect;
export type InsertGameStatus = z.infer<typeof insertGameStatusSchema>;
export type GameStatus = typeof gameStatuses.$inferSelect;
