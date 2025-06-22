import { PublicKey } from "@solana/web3.js";

export function formatWalletAddress(address: string, length: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function formatSOLAmount(amount: number | string, decimals: number = 2): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
}

export function shortenUsername(username: string, maxLength: number = 12): string {
  if (username.length <= maxLength) return username;
  return `${username.slice(0, maxLength - 3)}...`;
}

// Sound effects for night theme
export class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private volume: number = 0.3;
  private muted: boolean = false;

  constructor() {
    // Initialize sound effects
    this.loadSounds();
  }

  private loadSounds() {
    // Ambient night sounds
    this.sounds.ambient = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.wav");
    this.sounds.ambient.loop = true;
    this.sounds.ambient.volume = 0.1;

    // UI interaction sounds
    this.sounds.click = new Audio("https://www.soundjay.com/misc/sounds/button-click.wav");
    this.sounds.click.volume = 0.2;

    // Wallet connection success
    this.sounds.walletConnect = new Audio("https://www.soundjay.com/misc/sounds/success.wav");
    this.sounds.walletConnect.volume = 0.3;

    // Chat notification
    this.sounds.chatNotification = new Audio("https://www.soundjay.com/misc/sounds/notification.wav");
    this.sounds.chatNotification.volume = 0.2;

    // Win sound
    this.sounds.win = new Audio("https://www.soundjay.com/misc/sounds/coins.wav");
    this.sounds.win.volume = 0.4;
  }

  play(soundName: string) {
    if (this.muted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  startAmbient() {
    if (!this.muted) {
      this.sounds.ambient?.play().catch(console.error);
    }
  }

  stopAmbient() {
    this.sounds.ambient?.pause();
  }
}

export const soundManager = new SoundManager();
