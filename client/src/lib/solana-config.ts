import { Connection, clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK = import.meta.env.VITE_SOLANA_NETWORK || "mainnet-beta";

export const SOLANA_RPC_URL = 
  import.meta.env.VITE_SOLANA_RPC_URL || 
  clusterApiUrl(SOLANA_NETWORK as any);

export const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// Wallet detection utilities
export const detectWallets = () => {
  const wallets = {
    phantom: !!(window as any).solana?.isPhantom,
    backpack: !!(window as any).backpack?.isBackpack,
    solflare: !!(window as any).solflare?.isSolflare,
  };

  return wallets;
};

// Get wallet adapter
export const getWalletAdapter = (walletType: string) => {
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
