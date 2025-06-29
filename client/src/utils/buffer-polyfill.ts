// Comprehensive Buffer polyfill for browser compatibility with Solana Web3.js

interface BufferLike {
  from(data: any, encoding?: string): Uint8Array;
  alloc(size: number): Uint8Array;
  isBuffer(obj: any): boolean;
  concat(list: Uint8Array[]): Uint8Array;
}

export function initializeBufferPolyfill() {
  // Only initialize if Buffer is not already defined
  if (typeof globalThis.Buffer === 'undefined') {
    const BufferPolyfill: BufferLike = {
      from(data: any, encoding?: string): Uint8Array {
        if (data instanceof Uint8Array) {
          return data;
        }
        
        if (encoding === 'hex' && typeof data === 'string') {
          const bytes = new Uint8Array(data.length / 2);
          for (let i = 0; i < data.length; i += 2) {
            bytes[i / 2] = parseInt(data.substr(i, 2), 16);
          }
          return bytes;
        }
        
        if (encoding === 'base64' && typeof data === 'string') {
          const binaryString = atob(data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        }
        
        if (typeof data === 'string') {
          return new TextEncoder().encode(data);
        }
        
        if (Array.isArray(data)) {
          return new Uint8Array(data);
        }
        
        return new Uint8Array(data);
      },
      
      alloc(size: number): Uint8Array {
        return new Uint8Array(size);
      },
      
      isBuffer(obj: any): boolean {
        return obj instanceof Uint8Array;
      },
      
      concat(list: Uint8Array[]): Uint8Array {
        const totalLength = list.reduce((sum, arr) => sum + arr.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of list) {
          result.set(arr, offset);
          offset += arr.length;
        }
        return result;
      }
    };
    
    // Set up global Buffer
    globalThis.Buffer = BufferPolyfill as any;
  }
  
  // Ensure global is defined
  if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
  }
  
  // Additional Web3.js compatibility fixes
  if (typeof globalThis.process === 'undefined') {
    globalThis.process = {
      env: { NODE_ENV: 'development' },
      version: 'v18.0.0',
      browser: true
    } as any;
  }
}