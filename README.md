# Nightfall Casino

A comprehensive Solana-based gambling platform featuring Call of the Night anime aesthetic.

## Features

### Games
- **Moon Flip**: Cosmic coin flip game with animated 3D effects
- **Snake & Ladder**: Multiplayer board racing game with real-time dice mechanics
- Game lobby with matchmaking and room filtering

### Wallet Integration
- Multi-wallet support (Phantom, Solflare, Backpack)
- Real-time SOL balance tracking
- Secure wallet authentication

### Admin Features
- Comprehensive admin panel with user management
- Game controls and statistics
- Fee collection wallet configuration
- Audit logging and security features
- Vouch system for boosting player wins

### Social Features
- Real-time chat system with WebSocket integration
- Online user tracking
- Comprehensive leaderboards (wins, streaks, volume)
- Community features

### Technical Features
- Call of the Night anime aesthetic with dark themes
- Enhanced animations and particle effects
- Sound management with multiple ambient packs
- Responsive design with glass morphism effects

## Configuration

### Admin Wallet
Primary admin wallet: `GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb`

### Fee Collection
Playing fees are only charged to winners (0.0001 SOL) and collected to the admin wallet.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5000`

## Architecture

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Solana Web3.js integration

## Games

### Moon Flip
- Simple coin flip game with cosmic theme
- 50/50 odds with 2x multiplier
- Animated coin flip with sound effects

### Snake & Ladder
- Classic board game race to 100
- Multiplayer support with real-time dice rolls
- Enhanced with special effects and animations

## Admin Panel

Access the admin panel at `/admin` with an authorized wallet. Features include:

- User management and moderation
- Game statistics and controls
- Fee wallet management
- Casino settings configuration
- Audit logs and reports

## Deployment

The application is configured for Replit deployment with proper build steps and port configuration.

---

**Nightfall Casino** - Where night legends are born.