import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema, insertAdminSettingSchema, insertFeeWalletSchema, insertAuditLogSchema } from "@shared/schema";
import { isAuthorizedAdmin } from "./admin-config";
import { z } from "zod";

interface WebSocketWithUser extends WebSocket {
  userId?: number;
  username?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active WebSocket connections
  const activeConnections = new Set<WebSocketWithUser>();

  // WebSocket connection handler
  wss.on('connection', (ws: WebSocketWithUser) => {
    activeConnections.add(ws);
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth' && message.userId) {
          ws.userId = message.userId;
          ws.username = message.username;
          await storage.setUserOnline(message.userId, true);
          
          // Broadcast user joined
          broadcast({
            type: 'user_joined',
            username: message.username,
            onlineCount: await getOnlineCount()
          });
        }
        
        if (message.type === 'chat' && ws.userId && message.content) {
          const chatMessage = await storage.createChatMessage({
            userId: ws.userId,
            username: ws.username!,
            message: message.content
          });
          
          // Broadcast chat message to all clients
          broadcast({
            type: 'chat_message',
            message: chatMessage
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', async () => {
      activeConnections.delete(ws);
      if (ws.userId) {
        await storage.setUserOnline(ws.userId, false);
        broadcast({
          type: 'user_left',
          username: ws.username,
          onlineCount: await getOnlineCount()
        });
      }
    });
  });

  function broadcast(data: any) {
    const message = JSON.stringify(data);
    activeConnections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }

  async function getOnlineCount(): Promise<number> {
    const onlineUsers = await storage.getOnlineUsers();
    return onlineUsers.length;
  }

  // API Routes
  
  // User registration
  app.post('/api/users/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or wallet address already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      const existingWallet = await storage.getUserByWalletAddress(userData.walletAddress);
      if (existingWallet) {
        return res.status(400).json({ message: 'Wallet address already registered' });
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get user by wallet address
  app.get('/api/users/wallet/:address', async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update user balance
  app.patch('/api/users/balance', async (req, res) => {
    try {
      const { walletAddress, balance } = req.body;
      if (!walletAddress || balance === undefined) {
        return res.status(400).json({ message: 'Wallet address and balance are required' });
      }
      
      const user = await storage.updateUserBalance(walletAddress, balance);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get chat messages
  app.get('/api/chat/messages', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get leaderboards
  app.get('/api/leaderboard/:type', async (req, res) => {
    try {
      const { type } = req.params;
      let leaderboard;
      
      switch (type) {
        case 'wins':
          leaderboard = await storage.getLeaderboardByWins();
          break;
        case 'streak':
          leaderboard = await storage.getLeaderboardByStreak();
          break;
        case 'volume':
          leaderboard = await storage.getLeaderboardByVolume();
          break;
        default:
          return res.status(400).json({ message: 'Invalid leaderboard type' });
      }
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get online users count
  app.get('/api/users/online/count', async (req, res) => {
    try {
      const count = await getOnlineCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    const walletAddress = req.headers['x-wallet-address'];
    
    if (!walletAddress || !isAuthorizedAdmin(walletAddress)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    (req as any).adminWallet = walletAddress;
    next();
  };

  // Admin Routes
  
  // Verify admin status
  app.get('/api/admin/verify/:address', async (req, res) => {
    try {
      const isAuthorized = isAuthorizedAdmin(req.params.address);
      res.json({ isAuthorized });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get all users (admin only)
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Ban/unban user
  app.patch('/api/admin/users/:id/ban', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { banned } = req.body;
      
      const user = await storage.banUser(userId, banned);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: banned ? 'ban_user' : 'unban_user',
        targetUser: user.username,
        details: `User ${banned ? 'banned' : 'unbanned'} by admin`
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Mute/unmute user
  app.patch('/api/admin/users/:id/mute', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { muted } = req.body;
      
      const user = await storage.muteUser(userId, muted);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: muted ? 'mute_user' : 'unmute_user',
        targetUser: user.username,
        details: `User ${muted ? 'muted' : 'unmuted'} by admin`
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Adjust user balance
  app.patch('/api/admin/users/:id/balance', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { amount } = req.body;
      
      const user = await storage.adjustUserBalance(userId, amount);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'adjust_balance',
        targetUser: user.username,
        details: `Balance adjusted by ${amount} SOL`
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Set user vouch percentage
  app.patch('/api/admin/users/:id/vouch', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { percentage } = req.body;
      
      const user = await storage.setUserVouchPercentage(userId, percentage);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'set_vouch',
        targetUser: user.username,
        details: `Vouch percentage set to ${percentage}%`
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get admin settings
  app.get('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getAdminSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update admin settings
  app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const settingsData = req.body;
      const updatedSettings = [];

      for (const [key, value] of Object.entries(settingsData)) {
        if (typeof value === 'string') {
          const setting = await storage.setAdminSetting({ settingKey: key, settingValue: value });
          updatedSettings.push(setting);
        }
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'update_settings',
        details: `Updated ${updatedSettings.length} settings`
      });

      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get game settings
  app.get('/api/admin/game-settings', requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getGameSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update game setting
  app.patch('/api/admin/game-settings/:gameType', requireAdmin, async (req, res) => {
    try {
      const { gameType } = req.params;
      const updates = req.body;
      
      const setting = await storage.updateGameSetting(gameType, updates);
      if (!setting) {
        return res.status(404).json({ message: 'Game setting not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'update_game_setting',
        details: `Updated ${gameType} game settings`
      });

      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get fee wallets
  app.get('/api/admin/fee-wallets', requireAdmin, async (req, res) => {
    try {
      const wallets = await storage.getFeeWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Add fee wallet
  app.post('/api/admin/fee-wallets', requireAdmin, async (req, res) => {
    try {
      const walletData = insertFeeWalletSchema.parse(req.body);
      
      const wallet = await storage.addFeeWallet(walletData);

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'add_fee_wallet',
        details: `Added fee wallet: ${walletData.walletName}`
      });

      res.json(wallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid wallet data', errors: error.errors });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Update fee wallet
  app.patch('/api/admin/fee-wallets/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const wallet = await storage.updateFeeWallet(id, updates);
      if (!wallet) {
        return res.status(404).json({ message: 'Fee wallet not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'update_fee_wallet',
        details: `Updated fee wallet: ${wallet.walletName}`
      });

      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete fee wallet
  app.delete('/api/admin/fee-wallets/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const success = await storage.deleteFeeWallet(id);
      if (!success) {
        return res.status(404).json({ message: 'Fee wallet not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'delete_fee_wallet',
        details: `Deleted fee wallet with ID: ${id}`
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get audit logs
  app.get('/api/admin/audit-logs', requireAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Manual payout
  app.post('/api/admin/payouts', requireAdmin, async (req, res) => {
    try {
      const { userId, amount, reason } = req.body;
      
      const user = await storage.adjustUserBalance(userId, amount);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'manual_payout',
        targetUser: user.username,
        details: `Manual payout of ${amount} SOL. Reason: ${reason}`
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Flag user
  app.post('/api/admin/users/:id/flag', requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Log admin action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'flag_user',
        targetUser: user.username,
        details: 'User flagged for suspicious activity'
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Reset leaderboard
  app.post('/api/admin/leaderboard/reset', requireAdmin, async (req, res) => {
    try {
      const { type } = req.body;
      
      // This would typically reset specific leaderboard data
      // For now, just log the action
      await storage.createAuditLog({
        adminWallet: (req as any).adminWallet,
        action: 'reset_leaderboard',
        details: `Reset ${type} leaderboard`
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Game Routes
  
  // Moon Flip game
  app.post('/api/games/moon-flip', async (req, res) => {
    try {
      const { betAmount, selectedSide } = req.body;
      const walletAddress = req.headers['x-wallet-address'];
      
      if (!walletAddress) {
        return res.status(401).json({ message: 'Wallet address required' });
      }

      const user = await storage.getUserByWalletAddress(walletAddress as string);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const bet = parseFloat(betAmount);
      const userBalance = parseFloat(user.solBalance || "0");
      
      if (bet > userBalance) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      // Simulate coin flip (50/50 chance)
      const result = Math.random() < 0.5 ? "heads" : "tails";
      const isWin = result === selectedSide;
      const multiplier = 1.95; // 2x with 2.5% house edge
      const winAmount = isWin ? bet * multiplier : 0;
      const playingFee = isWin ? bet * 0.0001 : 0; // 0.01% fee only on wins
      const netWinAmount = winAmount - playingFee;

      // Update user balance
      const newBalance = userBalance - bet + (isWin ? netWinAmount : 0);
      await storage.updateUser(user.id, {
        solBalance: newBalance.toString(),
        totalWagered: (parseFloat(user.totalWagered || "0") + bet).toString(),
        totalWon: (parseFloat(user.totalWon || "0") + (isWin ? netWinAmount : 0)).toString(),
        currentStreak: isWin ? (user.currentStreak || 0) + 1 : 0,
        maxStreak: isWin ? Math.max((user.maxStreak || 0), (user.currentStreak || 0) + 1) : user.maxStreak,
        lastActivity: new Date()
      });

      // Record game stats
      await storage.createGameStats({
        userId: user.id,
        gameType: "moon-flip",
        betAmount: bet.toString(),
        winAmount: (isWin ? netWinAmount : 0).toString(),
        isWin
      });

      res.json({
        result,
        isWin,
        betAmount: bet.toString(),
        winAmount: (isWin ? netWinAmount : 0).toString(),
        newBalance: newBalance.toString(),
        playingFee: playingFee.toString()
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Snake & Ladder - Get rooms
  app.get('/api/games/snake-ladder/rooms', async (req, res) => {
    try {
      // In a real implementation, this would fetch from game rooms storage
      // For now, return mock data
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Snake & Ladder - Create room
  app.post('/api/games/snake-ladder/create', async (req, res) => {
    try {
      const { roomName, betAmount } = req.body;
      const walletAddress = req.headers['x-wallet-address'];
      
      if (!walletAddress) {
        return res.status(401).json({ message: 'Wallet address required' });
      }

      const user = await storage.getUserByWalletAddress(walletAddress as string);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Mock room creation - in real implementation would store in database
      const room = {
        id: Date.now(),
        roomName,
        hostUser: user,
        maxPlayers: 2,
        currentPlayers: 1,
        betAmount,
        status: "waiting",
        participants: [user]
      };

      res.json(room);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return httpServer;
}
