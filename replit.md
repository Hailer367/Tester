# Nightfall Casino

## Overview

Nightfall Casino is a comprehensive Solana-based gambling platform featuring Call of the Night anime aesthetic. The platform includes two luck-based games (Moon Flip and Snake & Ladder), real-time chat, leaderboards, sound management, and a secure admin panel. Users connect Solana wallets to play games, with fees only charged to winners and comprehensive admin oversight for game management.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React with TypeScript, Vite for build tooling, and Tailwind CSS with shadcn/ui components
- **Backend**: Express.js server with WebSocket support for real-time features
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Blockchain Integration**: Solana Web3.js for wallet connectivity and transaction handling
- **Build System**: Vite for development and production builds, with ESBuild for server bundling

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context for wallet state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Wallet Integration**: Support for Phantom, Backpack, and Solflare wallets

### Backend Architecture
- **API Layer**: Express.js REST endpoints with proper error handling
- **Real-time Communication**: WebSocket server for chat and live updates
- **Data Access**: Abstracted storage interface with memory storage implementation
- **Authentication**: Wallet-based authentication using public key verification

### Database Schema
- **Users Table**: Stores wallet addresses, usernames, avatars, balances, and gaming statistics
- **Chat Messages**: Real-time chat message storage with user references
- **Game Statistics**: Tracks betting history, wins/losses, and user performance metrics

## Data Flow

1. **User Authentication**: Users connect Solana wallets, create usernames, and get authenticated
2. **Real-time Updates**: WebSocket connections handle chat messages and user presence
3. **Game Interactions**: Users place bets, results are calculated, and statistics are updated
4. **Balance Management**: SOL balances are tracked and updated based on game outcomes

## External Dependencies

### Blockchain Integration
- **Solana Web3.js**: Wallet connection and transaction handling
- **Neon Database**: PostgreSQL database hosting with serverless architecture
- **Wallet Adapters**: Support for multiple Solana wallet providers

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **React Hook Form**: Form handling with validation

### Development Tools
- **Drizzle ORM**: Type-safe database operations
- **TypeScript**: Static type checking
- **Vite**: Fast development and build tooling
- **ESBuild**: Fast JavaScript bundling

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Production Build**: `npm run build` creates optimized production assets
- **Production Server**: `npm run start` runs the production server
- **Database**: Drizzle migrations with `npm run db:push`
- **Port Configuration**: Server runs on port 5000 with external port 80 mapping

The deployment uses autoscale configuration and includes proper build steps for both client and server components.

## Recent Changes

```
Recent Changes:
- June 22, 2025: Initial Solana wallet integration and admin panel setup
- June 22, 2025: Added Moon Flip and Snake & Ladder games with lobby system
- June 22, 2025: Implemented sound management system with multiple ambient packs
- June 22, 2025: Enhanced UI with animated particles and Call of the Night aesthetic
- June 22, 2025: Expanded admin panel with comprehensive user and game management
- June 22, 2025: Added enhanced visual styling with night cityscape background and improved navigation
- June 22, 2025: Configured GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb as primary admin and fee collection wallet
- June 28, 2025: Successfully migrated from Replit Agent to standard Replit environment
- June 28, 2025: Fixed browser compatibility issues and ensured clean deployment
- June 28, 2025: Implemented comprehensive payout system with automatic fee collection
- June 28, 2025: Added all 7 requested games (Moon Flip, Dice Duel, Snake & Ladder, Wheel of Fate, Mine Flip, Mystery Box, Roulette Lite)
- June 28, 2025: Added comprehensive icons throughout the website with unique favicon
- June 28, 2025: Implemented complete game API with create, join, complete, and cancel functionality
- June 28, 2025: Added automatic payout processing with 0.0001 SOL fee to admin wallet
- June 28, 2025: Created comprehensive navigation system with proper authentication
- June 28, 2025: Added SEO optimization with meta tags and social media integration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```