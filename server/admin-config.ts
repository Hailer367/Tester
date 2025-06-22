// Authorized admin wallet addresses - Replace with actual admin wallet addresses
export const AUTHORIZED_ADMIN_WALLETS = [
  // Add your authorized admin wallet addresses here
  // These are example addresses for testing - replace with real wallet addresses
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Example admin wallet 1
  "11111111111111111111111111111112", // Example admin wallet 2 (system program for testing)
];

// Check if wallet address is authorized admin
export function isAuthorizedAdmin(walletAddress: string): boolean {
  return AUTHORIZED_ADMIN_WALLETS.includes(walletAddress);
}

// Game types available in the casino
export const GAME_TYPES = [
  "dice",
  "coinflip", 
  "crash",
  "blackjack",
  "roulette",
  "slots"
];

// Default admin settings
export const DEFAULT_ADMIN_SETTINGS = {
  maintenanceMode: "false",
  maxPlayersOnline: "1000",
  defaultHouseEdge: "1.5",
  defaultPlayingFee: "2.0",
  enableDevnet: "false",
  bannerMessage: "",
  maxBetAmount: "100",
  minBetAmount: "0.01"
};