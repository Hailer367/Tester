import { 
  users, chatMessages, gameStats, adminSettings, gameSettings, feeWallets, auditLogs,
  type User, type InsertUser, type ChatMessage, type InsertChatMessage, 
  type GameStats, type InsertGameStats, type AdminSetting, type InsertAdminSetting,
  type GameSetting, type InsertGameSetting, type FeeWallet, type InsertFeeWallet,
  type AuditLog, type InsertAuditLog
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private gameStats: Map<number, GameStats>;
  private adminSettings: Map<string, AdminSetting>;
  private gameSettings: Map<string, GameSetting>;
  private feeWallets: Map<number, FeeWallet>;
  private auditLogs: Map<number, AuditLog>;
  private currentUserId: number;
  private currentChatId: number;
  private currentGameStatsId: number;
  private currentFeeWalletId: number;
  private currentAuditLogId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.gameStats = new Map();
    this.adminSettings = new Map();
    this.gameSettings = new Map();
    this.feeWallets = new Map();
    this.auditLogs = new Map();
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentGameStatsId = 1;
    this.currentFeeWalletId = 1;
    this.currentAuditLogId = 1;
    
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
}

export const storage = new MemStorage();
