// Browser polyfills for Solana Web3.js compatibility
import { Buffer } from 'buffer';

declare global {
  interface Window {
    global: any;
    Buffer: any;
  }
}

// Add global polyfills
if (typeof window !== 'undefined') {
  window.global = window.globalThis;
  window.Buffer = Buffer;
}

export {};