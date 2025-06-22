import { useState, useEffect } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export function useSolanaBalance(publicKey: PublicKey | null) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connection = new Connection(
    import.meta.env.VITE_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  const fetchBalance = async () => {
    if (!publicKey) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [publicKey]);

  // Poll for balance updates every 30 seconds
  useEffect(() => {
    if (!publicKey) return;

    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [publicKey]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance
  };
}
