import { 
  users, chatMessages, gameStats, adminSettings, gameSettings, feeWallets, auditLogs,
  shopItems, userInventory, purchaseLogs, collectorBots, gameStatuses,
  type User, type InsertUser, type ChatMessage, type InsertChatMessage, 
  type GameStats, type InsertGameStats, type AdminSetting, type InsertAdminSetting,
  type GameSetting, type InsertGameSetting, type FeeWallet, type InsertFeeWallet,
  type AuditLog, type InsertAuditLog, type ShopItem, type InsertShopItem,
  type UserInventory, type InsertUserInventory, type PurchaseLog, type InsertPurchaseLog,
  type CollectorBot, type InsertCollectorBot, type GameStatus, type InsertGameStatus
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateUserBalance(walletAddress: string, balance: string): Promise<User | undefined>;
  getOnlineUsers(): Promise<User[]>;
  setUserOnline(id: number, isOnline: boolean): Promise<void>;
  
  // Chat operations
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Leaderboard operations
  getLeaderboardByWins(): Promise<User[]>;
  getLeaderboardByStreak(): Promise<User[]>;
  getLeaderboardByVolume(): Promise<User[]>;
  
  // Game stats operations
  createGameStats(stats: InsertGameStats): Promise<GameStats>;
  updateUserStats(userId: number, isWin: boolean, betAmount: string, winAmount: string): Promise<void>;
  
  // Admin operations
  getAdminSettings(): Promise<AdminSetting[]>;
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  setAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
  
  // Game settings
  getGameSettings(): Promise<GameSetting[]>;
  getGameSetting(gameType: string): Promise<GameSetting | undefined>;
  updateGameSetting(gameType: string, updates: Partial<GameSetting>): Promise<GameSetting | undefined>;
  
  // Fee wallets
  getFeeWallets(): Promise<FeeWallet[]>;
  addFeeWallet(wallet: InsertFeeWallet): Promise<FeeWallet>;
  updateFeeWallet(id: number, updates: Partial<FeeWallet>): Promise<FeeWallet | undefined>;
  deleteFeeWallet(id: number): Promise<boolean>;
  
  // Audit logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  
  // Admin user management
  setUserAdmin(userId: number, isAdmin: boolean): Promise<User | undefined>;
  banUser(userId: number, banned: boolean): Promise<User | undefined>;
  muteUser(userId: number, muted: boolean): Promise<User | undefined>;
  setUserVouchPercentage(userId: number, percentage: string): Promise<User | undefined>;
  adjustUserBalance(userId: number, amount: string): Promise<User | undefined>;
  
  // Shop operations
  getShopItems(): Promise<ShopItem[]>;
  getShopItem(id: number): Promise<ShopItem | undefined>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: number, updates: Partial<ShopItem>): Promise<ShopItem | undefined>;
  deleteShopItem(id: number): Promise<boolean>;
  
  // User inventory operations
  getUserInventory(userId: number): Promise<UserInventory[]>;
  addToInventory(inventory: InsertUserInventory): Promise<UserInventory>;
  updateInventoryStatus(userId: number, itemId: number, status: string): Promise<UserInventory | undefined>;
  
  // Purchase operations
  createPurchaseLog(log: InsertPurchaseLog): Promise<PurchaseLog>;
  getUserPurchases(userId: number): Promise<PurchaseLog[]>;
  
  // Collector bot operations
  getCollectorBots(): Promise<CollectorBot[]>;
  getCollectorBot(id: number): Promise<CollectorBot | undefined>;
  createCollectorBot(bot: InsertCollectorBot): Promise<CollectorBot>;
  updateCollectorBot(id: number, updates: Partial<CollectorBot>): Promise<CollectorBot | undefined>;
  deleteCollectorBot(id: number): Promise<boolean>;
  
  // Game status operations
  getGameStatuses(): Promise<GameStatus[]>;
  getGameStatus(gameType: string): Promise<GameStatus | undefined>;
  updateGameStatus(gameType: string, updates: Partial<GameStatus>): Promise<GameStatus | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private gameStats: Map<number, GameStats>;
  private adminSettings: Map<string, AdminSetting>;
  private gameSettings: Map<string, GameSetting>;
  private feeWallets: Map<number, FeeWallet>;
  private auditLogs: Map<number, AuditLog>;
  private shopItems: Map<number, ShopItem>;
  private userInventory: Map<string, UserInventory>; // key: userId-itemId
  private purchaseLogs: Map<number, PurchaseLog>;
  private collectorBots: Map<number, CollectorBot>;
  private gameStatuses: Map<string, GameStatus>;
  private currentUserId: number;
  private currentChatId: number;
  private currentGameStatsId: number;
  private currentFeeWalletId: number;
  private currentAuditLogId: number;
  private currentShopItemId: number;
  private currentInventoryId: number;
  private currentPurchaseLogId: number;
  private currentCollectorBotId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.gameStats = new Map();
    this.adminSettings = new Map();
    this.gameSettings = new Map();
    this.feeWallets = new Map();
    this.auditLogs = new Map();
    this.shopItems = new Map();
    this.userInventory = new Map();
    this.purchaseLogs = new Map();
    this.collectorBots = new Map();
    this.gameStatuses = new Map();
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentGameStatsId = 1;
    this.currentFeeWalletId = 1;
    this.currentAuditLogId = 1;
    this.currentShopItemId = 1;
    this.currentInventoryId = 1;
    this.currentPurchaseLogId = 1;
    this.currentCollectorBotId = 1;
    
    // Initialize default settings
    this.initializeDefaultSettings();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      walletAddress: insertUser.walletAddress,
      avatar: insertUser.avatar || "U",
      profileColor: insertUser.profileColor || "purple",
      solBalance: "0",
      totalWagered: "0",
      totalWon: "0",
      currentStreak: 0,
      maxStreak: 0,
      lastActivity: new Date(),
      isOnline: true,
      isAdmin: false,
      isBanned: false,
      isMuted: false,
      vouchPercentage: "0",
      activeGames: 0,
      playerTitle: null,
      soundPack: "night_ambience",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserBalance(walletAddress: string, balance: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(u => u.walletAddress === walletAddress);
    if (!user) return undefined;
    
    return this.updateUser(user.id, { solBalance: balance, lastActivity: new Date() });
  }

  async getOnlineUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  async setUserOnline(id: number, isOnline: boolean): Promise<void> {
    await this.updateUser(id, { isOnline, lastActivity: new Date() });
  }

  async getChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit)
      .reverse();
    return messages;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = {
      id,
      userId: insertMessage.userId || null,
      username: insertMessage.username,
      message: insertMessage.message,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getLeaderboardByWins(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => parseFloat(b.totalWon || "0") - parseFloat(a.totalWon || "0"))
      .slice(0, 10);
  }

  async getLeaderboardByStreak(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.maxStreak || 0) - (a.maxStreak || 0))
      .slice(0, 10);
  }

  async getLeaderboardByVolume(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => parseFloat(b.totalWagered || "0") - parseFloat(a.totalWagered || "0"))
      .slice(0, 10);
  }

  async createGameStats(insertStats: InsertGameStats): Promise<GameStats> {
    const id = this.currentGameStatsId++;
    const stats: GameStats = {
      id,
      userId: insertStats.userId || null,
      gameType: insertStats.gameType,
      betAmount: insertStats.betAmount,
      winAmount: insertStats.winAmount || null,
      isWin: insertStats.isWin,
      timestamp: new Date(),
    };
    this.gameStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId: number, isWin: boolean, betAmount: string, winAmount: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) return;

    const currentWagered = parseFloat(user.totalWagered || "0");
    const currentWon = parseFloat(user.totalWon || "0");
    const bet = parseFloat(betAmount);
    const win = parseFloat(winAmount);

    const updates: Partial<User> = {
      totalWagered: (currentWagered + bet).toString(),
      totalWon: (currentWon + win).toString(),
      lastActivity: new Date(),
    };

    if (isWin) {
      updates.currentStreak = (user.currentStreak || 0) + 1;
      updates.maxStreak = Math.max(user.maxStreak || 0, updates.currentStreak);
    } else {
      updates.currentStreak = 0;
    }

    await this.updateUser(userId, updates);
  }

  private initializeDefaultSettings() {
    // Initialize default admin settings
    const defaultSettings = [
      { settingKey: "maintenanceMode", settingValue: "false" },
      { settingKey: "maxPlayersOnline", settingValue: "1000" },
      { settingKey: "defaultHouseEdge", settingValue: "1.5" },
      { settingKey: "enableDevnet", settingValue: "false" },
      { settingKey: "bannerMessage", settingValue: "" },
    ];

    defaultSettings.forEach(setting => {
      const adminSetting: AdminSetting = {
        id: this.adminSettings.size + 1,
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        updatedAt: new Date(),
      };
      this.adminSettings.set(setting.settingKey, adminSetting);
    });

    // Initialize default game settings
    const gameTypes = ["dice", "coinflip", "crash", "blackjack"];
    gameTypes.forEach(gameType => {
      const gameSetting: GameSetting = {
        id: this.gameSettings.size + 1,
        gameType,
        houseEdge: "1.5",
        playingFee: "2.0",
        isEnabled: true,
        updatedAt: new Date(),
      };
      this.gameSettings.set(gameType, gameSetting);
    });
  }

  async getAdminSettings(): Promise<AdminSetting[]> {
    return Array.from(this.adminSettings.values());
  }

  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    return this.adminSettings.get(key);
  }

  async setAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const existing = this.adminSettings.get(setting.settingKey);
    const adminSetting: AdminSetting = {
      id: existing?.id || this.adminSettings.size + 1,
      settingKey: setting.settingKey,
      settingValue: setting.settingValue,
      updatedAt: new Date(),
    };
    this.adminSettings.set(setting.settingKey, adminSetting);
    return adminSetting;
  }

  async getGameSettings(): Promise<GameSetting[]> {
    return Array.from(this.gameSettings.values());
  }

  async getGameSetting(gameType: string): Promise<GameSetting | undefined> {
    return this.gameSettings.get(gameType);
  }

  async updateGameSetting(gameType: string, updates: Partial<GameSetting>): Promise<GameSetting | undefined> {
    const existing = this.gameSettings.get(gameType);
    if (!existing) return undefined;

    const updated: GameSetting = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.gameSettings.set(gameType, updated);
    return updated;
  }

  async getFeeWallets(): Promise<FeeWallet[]> {
    return Array.from(this.feeWallets.values());
  }

  async addFeeWallet(wallet: InsertFeeWallet): Promise<FeeWallet> {
    const id = this.currentFeeWalletId++;
    const feeWallet: FeeWallet = {
      id,
      walletAddress: wallet.walletAddress,
      walletName: wallet.walletName,
      isActive: true,
      gameTypes: wallet.gameTypes || [],
      totalCollected: "0",
      createdAt: new Date(),
    };
    this.feeWallets.set(id, feeWallet);
    return feeWallet;
  }

  async updateFeeWallet(id: number, updates: Partial<FeeWallet>): Promise<FeeWallet | undefined> {
    const existing = this.feeWallets.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.feeWallets.set(id, updated);
    return updated;
  }

  async deleteFeeWallet(id: number): Promise<boolean> {
    return this.feeWallets.delete(id);
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const id = this.currentAuditLogId++;
    const auditLog: AuditLog = {
      id,
      adminWallet: log.adminWallet,
      action: log.action,
      targetUser: log.targetUser || null,
      details: log.details || null,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }

  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async setUserAdmin(userId: number, isAdmin: boolean): Promise<User | undefined> {
    return this.updateUser(userId, { isAdmin });
  }

  async banUser(userId: number, banned: boolean): Promise<User | undefined> {
    return this.updateUser(userId, { isBanned: banned });
  }

  async muteUser(userId: number, muted: boolean): Promise<User | undefined> {
    return this.updateUser(userId, { isMuted: muted });
  }

  async setUserVouchPercentage(userId: number, percentage: string): Promise<User | undefined> {
    return this.updateUser(userId, { vouchPercentage: percentage });
  }

  async adjustUserBalance(userId: number, amount: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const currentBalance = parseFloat(user.solBalance || "0");
    const adjustment = parseFloat(amount);
    const newBalance = Math.max(0, currentBalance + adjustment);

    return this.updateUser(userId, { 
      solBalance: newBalance.toString(),
      lastActivity: new Date()
    });
  }

  // Shop operations
  async getShopItems(): Promise<ShopItem[]> {
    return Array.from(this.shopItems.values());
  }

  async getShopItem(id: number): Promise<ShopItem | undefined> {
    return this.shopItems.get(id);
  }

  async createShopItem(item: InsertShopItem): Promise<ShopItem> {
    const id = this.currentShopItemId++;
    const shopItem: ShopItem = {
      id,
      name: item.name,
      category: item.category,
      description: item.description,
      rarity: item.rarity || "common",
      priceInSOL: item.priceInSOL || "0",
      unlockCondition: item.unlockCondition || null,
      isUnlockable: item.isUnlockable ?? true,
      isPurchasable: item.isPurchasable ?? false,
      previewUrl: item.previewUrl || null,
      isHidden: item.isHidden ?? false,
      isSeasonal: item.isSeasonal ?? false,
      createdAt: new Date(),
    };
    this.shopItems.set(id, shopItem);
    return shopItem;
  }

  async updateShopItem(id: number, updates: Partial<ShopItem>): Promise<ShopItem | undefined> {
    const item = this.shopItems.get(id);
    if (!item) return undefined;

    const updated: ShopItem = { ...item, ...updates };
    this.shopItems.set(id, updated);
    return updated;
  }

  async deleteShopItem(id: number): Promise<boolean> {
    return this.shopItems.delete(id);
  }

  // User inventory operations
  async getUserInventory(userId: number): Promise<UserInventory[]> {
    return Array.from(this.userInventory.values()).filter(inv => inv.userId === userId);
  }

  async addToInventory(inventory: InsertUserInventory): Promise<UserInventory> {
    const id = this.currentInventoryId++;
    const key = `${inventory.userId}-${inventory.itemId}`;
    const userInventory: UserInventory = {
      id,
      userId: inventory.userId,
      itemId: inventory.itemId,
      status: inventory.status || "owned",
      unlockedAt: new Date(),
    };
    this.userInventory.set(key, userInventory);
    return userInventory;
  }

  async updateInventoryStatus(userId: number, itemId: number, status: string): Promise<UserInventory | undefined> {
    const key = `${userId}-${itemId}`;
    const inventory = this.userInventory.get(key);
    if (!inventory) return undefined;

    const updated: UserInventory = { ...inventory, status };
    this.userInventory.set(key, updated);
    return updated;
  }

  // Purchase operations
  async createPurchaseLog(log: InsertPurchaseLog): Promise<PurchaseLog> {
    const id = this.currentPurchaseLogId++;
    const purchaseLog: PurchaseLog = {
      id,
      userId: log.userId,
      itemId: log.itemId,
      amountSOL: log.amountSOL,
      txHash: log.txHash || null,
      timestamp: new Date(),
    };
    this.purchaseLogs.set(id, purchaseLog);
    return purchaseLog;
  }

  async getUserPurchases(userId: number): Promise<PurchaseLog[]> {
    return Array.from(this.purchaseLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  // Collector bot operations
  async getCollectorBots(): Promise<CollectorBot[]> {
    return Array.from(this.collectorBots.values());
  }

  async getCollectorBot(id: number): Promise<CollectorBot | undefined> {
    return this.collectorBots.get(id);
  }

  async createCollectorBot(bot: InsertCollectorBot): Promise<CollectorBot> {
    const id = this.currentCollectorBotId++;
    const collectorBot: CollectorBot = {
      id,
      username: bot.username,
      profilePicture: bot.profilePicture,
      walletPrivateKey: bot.walletPrivateKey, // Should be encrypted in real implementation
      allowedGames: bot.allowedGames,
      winProbability: bot.winProbability,
      gameInterval: bot.gameInterval,
      canPlayMultiple: bot.canPlayMultiple ?? false,
      minStakeSOL: bot.minStakeSOL,
      maxStakeSOL: bot.maxStakeSOL,
      canBuyShopItems: bot.canBuyShopItems ?? false,
      allowedShopItems: bot.allowedShopItems || [],
      ghostMode: bot.ghostMode ?? false,
      botType: bot.botType || "COLLECTOR",
      isActive: false,
      activeSchedule: bot.activeSchedule || null,
      createdBy: bot.createdBy,
      createdAt: new Date(),
    };
    this.collectorBots.set(id, collectorBot);
    return collectorBot;
  }

  async updateCollectorBot(id: number, updates: Partial<CollectorBot>): Promise<CollectorBot | undefined> {
    const bot = this.collectorBots.get(id);
    if (!bot) return undefined;

    const updated: CollectorBot = { ...bot, ...updates };
    this.collectorBots.set(id, updated);
    return updated;
  }

  async deleteCollectorBot(id: number): Promise<boolean> {
    return this.collectorBots.delete(id);
  }

  // Game status operations
  async getGameStatuses(): Promise<GameStatus[]> {
    return Array.from(this.gameStatuses.values());
  }

  async getGameStatus(gameType: string): Promise<GameStatus | undefined> {
    return this.gameStatuses.get(gameType);
  }

  async updateGameStatus(gameType: string, updates: Partial<GameStatus>): Promise<GameStatus | undefined> {
    const status = this.gameStatuses.get(gameType);
    if (!status) {
      // Create new status if it doesn't exist
      const newStatus: GameStatus = {
        id: this.gameStatuses.size + 1,
        gameType,
        isLocked: false,
        lockReason: null,
        lockedBy: null,
        lockedAt: null,
        ...updates
      };
      this.gameStatuses.set(gameType, newStatus);
      return newStatus;
    }

    const updated: GameStatus = { ...status, ...updates };
    this.gameStatuses.set(gameType, updated);
    return updated;
  }
}

export const storage = new MemStorage();
