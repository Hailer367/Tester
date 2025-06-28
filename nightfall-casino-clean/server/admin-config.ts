// Authorized admin wallet addresses - Replace with actual admin wallet addresses
export const AUTHORIZED_ADMIN_WALLETS = [
  "GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb", // Main admin wallet
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
  minBetAmount: "0.01",
  feeCollectionWallet: "GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb"
};