import { apiRequest } from "@/lib/queryClient";

// Authorized admin wallet addresses (should match server config)
const AUTHORIZED_ADMIN_WALLETS = [
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Example admin wallet
];

export async function isAuthorizedAdmin(walletAddress: string): Promise<boolean> {
  try {
    // Check local list first
    if (AUTHORIZED_ADMIN_WALLETS.includes(walletAddress)) {
      return true;
    }

    // Verify with backend
    const response = await apiRequest("GET", `/api/admin/verify/${walletAddress}`);
    const result = await response.json();
    return result.isAuthorized;
  } catch (error) {
    console.error("Error verifying admin status:", error);
    return false;
  }
}

export function formatUserRole(user: any): string {
  if (user.isAdmin) return "Administrator";
  if (user.vouchPercentage && parseFloat(user.vouchPercentage) > 0) return "VIP Player";
  return "Player";
}

export function getUserRoleColor(user: any): string {
  if (user.isAdmin) return "from-red-500 to-pink-500";
  if (user.vouchPercentage && parseFloat(user.vouchPercentage) > 0) return "from-yellow-500 to-orange-500";
  return "from-purple-500 to-blue-500";
}

export function formatPercentage(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `${num.toFixed(2)}%`;
}

export function formatSolAmount(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${num.toFixed(4)} SOL`;
}