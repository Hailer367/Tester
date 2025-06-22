import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertChatMessageSchema } from "@shared/schema";
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

  return httpServer;
}
