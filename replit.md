# Nightfall Casino

## Overview

Nightfall Casino is a full-stack web application built as a Solana-based gambling platform with real-time chat functionality. The application features a dark, night-themed UI and provides a casino gaming environment where users can connect their Solana wallets to participate in games and interact with other players.

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

## Changelog

```
Changelog:
- June 22, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```