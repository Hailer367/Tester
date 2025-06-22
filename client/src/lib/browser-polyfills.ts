// Browser polyfills for Solana Web3.js compatibility
declare global {
  interface Window {
    global: any;
    Buffer: any;
  }
}

// Add global polyfill
if (typeof window !== 'undefined') {
  window.global = window.globalThis;
}

export {};