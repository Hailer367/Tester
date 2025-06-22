import { users, chatMessages, gameStats, type User, type InsertUser, type ChatMessage, type InsertChatMessage, type GameStats, type InsertGameStats } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private gameStats: Map<number, GameStats>;
  private currentUserId: number;
  private currentChatId: number;
  private currentGameStatsId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.gameStats = new Map();
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentGameStatsId = 1;
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
}

export const storage = new MemStorage();
