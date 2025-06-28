import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  user: User | null;
  solBalance: number;
  connect: (walletType: string) => Promise<void>;
  disconnect: () => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  updateBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [solBalance, setSolBalance] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  // Solana RPC connection
  const connection = new Connection(
    import.meta.env.VITE_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // Check for existing wallet connection on load
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const savedWalletAddress = localStorage.getItem("walletAddress");
    const savedUser = localStorage.getItem("user");
    
    if (savedWalletAddress && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setPublicKey(new PublicKey(savedWalletAddress));
        setConnected(true);
        updateBalance();
      } catch (error) {
        console.error("Error restoring wallet session:", error);
        localStorage.removeItem("walletAddress");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const detectWallet = (walletType: string) => {
    if (typeof window === 'undefined') return false;
    
    switch (walletType) {
      case "phantom":
        return (window as any).solana?.isPhantom;
      case "backpack":
        return (window as any).backpack?.isBackpack;
      case "solflare":
        return (window as any).solflare?.isSolflare;
      default:
        return false;
    }
  };

  const getWalletAdapter = (walletType: string) => {
    if (typeof window === 'undefined') return null;
    
    switch (walletType) {
      case "phantom":
        return (window as any).solana;
      case "backpack":
        return (window as any).backpack;
      case "solflare":
        return (window as any).solflare;
      default:
        return null;
    }
  };

  const connect = async (walletType: string) => {
    setConnecting(true);
    
    try {
      if (!detectWallet(walletType)) {
        throw new Error(`${walletType} wallet not detected. Please install the extension.`);
      }

      const wallet = getWalletAdapter(walletType);
      if (!wallet) {
        throw new Error(`${walletType} wallet adapter not found`);
      }

      // Request connection
      const response = await wallet.connect();
      const walletPublicKey = response.publicKey || wallet.publicKey;
      
      if (!walletPublicKey) {
        throw new Error("Failed to get wallet public key");
      }

      setPublicKey(walletPublicKey);
      
      // Check if user exists
      try {
        const userResponse = await apiRequest("GET", `/api/users/wallet/${walletPublicKey.toString()}`);
        const existingUser = await userResponse.json();
        setUser(existingUser);
        setConnected(true);
        setShowWelcome(true);
        
        // Save to localStorage
        localStorage.setItem("walletAddress", walletPublicKey.toString());
        localStorage.setItem("user", JSON.stringify(existingUser));
        
        await updateBalance();
      } catch (error) {
        // User doesn't exist, they need to register
        setConnected(true);
        localStorage.setItem("walletAddress", walletPublicKey.toString());
      }
      
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey(null);
    setUser(null);
    setSolBalance(0);
    setShowWelcome(false);
    
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("user");
    
    // Disconnect from wallet adapter if available
    try {
      const wallets = [
        (window as any).solana,
        (window as any).backpack,
        (window as any).solflare
      ];
      
      wallets.forEach(wallet => {
        if (wallet?.disconnect) {
          wallet.disconnect();
        }
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const updateBalance = async () => {
    if (!publicKey || typeof window === 'undefined') return;
    
    try {
      const balance = await connection.getBalance(publicKey);
      const solAmount = balance / LAMPORTS_PER_SOL;
      setSolBalance(solAmount);
      
      // Update balance in backend
      if (user) {
        await apiRequest("PATCH", "/api/users/balance", {
          walletAddress: publicKey.toString(),
          balance: solAmount.toString()
        });
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const value: WalletContextType = {
    connected,
    connecting,
    publicKey,
    user,
    solBalance,
    connect,
    disconnect,
    showWelcome,
    setShowWelcome,
    updateBalance
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
