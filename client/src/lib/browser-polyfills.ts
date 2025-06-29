// Browser polyfills for Solana Web3.js compatibility
import { Buffer } from 'buffer';

declare global {
  interface Window {
    global: any;
    Buffer: any;
    process: any;
  }
  var global: any;
  var Buffer: any;
  var process: any;
}

// Add global polyfills
if (typeof window !== 'undefined') {
  // Set up globals
  window.global = window.globalThis;
  globalThis.global = globalThis;
  window.Buffer = Buffer;
  globalThis.Buffer = Buffer;
  
  // Process polyfill for Web3.js
  if (!window.process) {
    window.process = {
      env: { NODE_ENV: 'development' },
      version: 'v18.0.0',
      browser: true,
      nextTick: (fn: Function) => setTimeout(fn, 0)
    };
    globalThis.process = window.process;
  }
}

// Catch any unhandled rejections from Solana Web3.js
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Only prevent default for Buffer-related errors
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('Buffer') || 
         event.reason.message.includes('TextEncoder') ||
         event.reason.message.includes('crypto'))) {
      console.warn('Handled Solana Web3.js compatibility issue:', event.reason);
      event.preventDefault();
    }
  });
}

export {};