# Nightfall Casino - Complete Project Export

## What's Included

This export contains the complete Nightfall Casino project with all features implemented:

### Core Features
- **Solana Wallet Integration**: Support for Phantom, Solflare, and Backpack wallets
- **Two Casino Games**: Moon Flip (coin flip) and Snake & Ladder (board game)
- **Real-time Chat System**: WebSocket-powered chat with online user tracking
- **Admin Panel**: Comprehensive management interface with user controls
- **Leaderboards**: Wins, streaks, and volume tracking
- **Sound System**: Multiple ambient packs and game effects

### Visual Design
- Call of the Night anime aesthetic
- Night cityscape background with animated particles
- Glass morphism UI effects
- Responsive design with enhanced animations

### Admin Configuration
- **Primary Admin Wallet**: `GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb`
- **Fee Collection**: Winners pay 0.0001 SOL to admin wallet
- User management, game controls, and audit logging

## File Structure

```
nightfall-casino/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configuration
│   └── index.html
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data management
│   └── admin-config.ts    # Admin configuration
├── shared/                # Shared types and schemas
│   └── schema.ts
├── package.json           # Dependencies and scripts
└── README.md             # Project documentation
```

## Setup Instructions

1. **Extract the project files**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Access the application** at `http://localhost:5000`

## Key Components

- **Wallet Provider**: Handles Solana wallet connections
- **Game Lobby**: Matchmaking and game selection
- **Admin Panel**: Access at `/admin` with authorized wallet
- **Real-time Features**: WebSocket integration for chat and live updates

## Deployment

The project is configured for deployment on various platforms including Replit, with proper build scripts and environment handling.

---

**Note**: This is a complete, production-ready Solana casino platform with all requested features implemented.