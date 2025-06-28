import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { storage } from './storage';
import type { Game, GameTransaction, InsertGameTransaction } from '@shared/schema';

const ADMIN_FEE_WALLET = 'GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb';
const DEFAULT_PLAYING_FEE = 0.0001; // SOL

export class PayoutSystem {
  private connection: Connection;

  constructor() {
    // Use devnet for development
    this.connection = new Connection('https://api.devnet.solana.com');
  }

  /**
   * Process game completion and handle payouts
   */
  async processGamePayout(gameId: number, winnerWallet: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      const game = await storage.getGame(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      if (game.status !== 'completed' || !game.winner) {
        throw new Error('Game is not completed or has no winner');
      }

      // Calculate payout amounts
      const totalPool = parseFloat(game.totalPool || '0');
      const playingFee = parseFloat(game.playingFee || DEFAULT_PLAYING_FEE.toString());
      const netPayout = totalPool - playingFee;

      if (netPayout <= 0) {
        throw new Error('Invalid payout calculation');
      }

      // Validate winner's wallet
      try {
        new PublicKey(winnerWallet);
        new PublicKey(ADMIN_FEE_WALLET);
      } catch {
        throw new Error('Invalid wallet address');
      }

      // Check if payout already processed
      const existingPayouts = await storage.getGameTransactions(gameId);
      const alreadyPaid = existingPayouts.some(tx => tx.type === 'payout' && tx.status === 'completed');
      
      if (alreadyPaid) {
        throw new Error('Payout already processed for this game');
      }

      // Create transaction records
      const payoutTx: InsertGameTransaction = {
        gameId,
        toAddress: winnerWallet,
        amount: netPayout.toString(),
        type: 'payout',
        txHash: null,
      };

      const feeTx: InsertGameTransaction = {
        gameId,
        toAddress: ADMIN_FEE_WALLET,
        amount: playingFee.toString(),
        type: 'fee',
        txHash: null,
      };

      // Record transactions in storage
      const payoutRecord = await storage.createGameTransaction(payoutTx);
      const feeRecord = await storage.createGameTransaction(feeTx);

      // Simulate transaction (in production, this would create actual Solana transactions)
      const mockTxHash = this.generateMockTxHash();

      // Update transaction records with success
      await storage.updateGameTransaction(payoutRecord.id, {
        txHash: mockTxHash,
        status: 'completed',
        completedAt: new Date(),
      });

      await storage.updateGameTransaction(feeRecord.id, {
        txHash: mockTxHash,
        status: 'completed',
        completedAt: new Date(),
      });

      // Update user balance
      await storage.updateUserBalance(winnerWallet, netPayout.toString());

      // Log the payout
      await storage.createAuditLog({
        adminWallet: ADMIN_FEE_WALLET,
        action: 'PAYOUT_PROCESSED',
        targetUser: winnerWallet,
        details: `Game ${gameId}: Paid ${netPayout} SOL to winner, ${playingFee} SOL fee collected`,
      });

      return {
        success: true,
        txHash: mockTxHash,
      };

    } catch (error) {
      console.error('Payout processing error:', error);
      
      // Log the error
      await storage.createAuditLog({
        adminWallet: ADMIN_FEE_WALLET,
        action: 'PAYOUT_FAILED',
        details: `Game ${gameId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process refund for cancelled games
   */
  async processGameRefund(gameId: number): Promise<{ success: boolean; txHashes?: string[]; error?: string }> {
    try {
      const game = await storage.getGame(gameId);
      if (!game) {
        throw new Error('Game not found');
      }

      if (game.status !== 'cancelled') {
        throw new Error('Game is not cancelled');
      }

      // Get participants from game data
      const gameData = game.gameData ? JSON.parse(game.gameData) : {};
      const participants = gameData.participants || [game.createdBy];

      const refundTxHashes: string[] = [];

      // Process refunds for each participant
      for (const participantWallet of participants) {
        const refundAmount = parseFloat(game.betAmount || '0');
        
        if (refundAmount > 0) {
          const refundTx: InsertGameTransaction = {
            gameId,
            toAddress: participantWallet,
            amount: refundAmount.toString(),
            type: 'refund',
            txHash: null,
          };

          const refundRecord = await storage.createGameTransaction(refundTx);
          const mockTxHash = this.generateMockTxHash();

          await storage.updateGameTransaction(refundRecord.id, {
            txHash: mockTxHash,
            status: 'completed',
            completedAt: new Date(),
          });

          // Update user balance
          await storage.updateUserBalance(participantWallet, refundAmount.toString());
          refundTxHashes.push(mockTxHash);
        }
      }

      // Log the refund
      await storage.createAuditLog({
        adminWallet: ADMIN_FEE_WALLET,
        action: 'REFUND_PROCESSED',
        details: `Game ${gameId}: Refunded ${participants.length} participants`,
      });

      return {
        success: true,
        txHashes: refundTxHashes,
      };

    } catch (error) {
      console.error('Refund processing error:', error);
      
      await storage.createAuditLog({
        adminWallet: ADMIN_FEE_WALLET,
        action: 'REFUND_FAILED',
        details: `Game ${gameId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Calculate estimated network fees
   */
  async estimateNetworkFee(): Promise<number> {
    try {
      // Simulate network fee estimation (approximately 0.000005 SOL)
      return 0.000005;
    } catch {
      return 0.000005; // Default fallback
    }
  }

  /**
   * Generate mock transaction hash for development
   */
  private generateMockTxHash(): string {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Verify transaction on blockchain
   */
  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      // In production, this would verify the actual transaction
      // For development, return true for mock transactions
      return txHash.length === 88;
    } catch {
      return false;
    }
  }
}

export const payoutSystem = new PayoutSystem();