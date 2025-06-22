import { useState } from "react";
import { useWallet } from "./wallet-provider";
import { WalletModal } from "./wallet-modal";
import { UsernameModal } from "./username-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function WalletButton() {
  const { connected, connecting, user, publicKey, solBalance, disconnect } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="glass-morphism rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-white/10 transition-all duration-300 group">
            {/* User Avatar */}
            <div 
              className={`w-8 h-8 bg-gradient-to-br ${getUserGradient(user.profileColor)} rounded-full flex items-center justify-center text-[var(--midnight)] font-bold text-sm`}
            >
              {user.avatar}
            </div>
            
            {/* User Info */}
            <div className="text-left">
              <div className="text-sm font-medium text-white">{user.username}</div>
              <div className="text-xs text-gray-400">{formatAddress(user.walletAddress)}</div>
            </div>
            
            {/* SOL Balance */}
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--gold)]">{solBalance.toFixed(2)} SOL</div>
              <div className="text-xs text-gray-400">Balance</div>
            </div>
            
            <i className="fas fa-chevron-down text-gray-400 group-hover:text-white transition-colors duration-300"></i>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64 glass-morphism border-[var(--gold)]/30 bg-[var(--deep-purple)]/80 backdrop-blur-lg">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-12 h-12 bg-gradient-to-br ${getUserGradient(user.profileColor)} rounded-full flex items-center justify-center text-[var(--midnight)] font-bold`}
              >
                {user.avatar}
              </div>
              <div>
                <div className="font-semibold text-white">{user.username}</div>
                <div className="text-sm text-gray-400">{formatAddress(user.walletAddress)}</div>
              </div>
            </div>
          </div>
          
          <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
            <i className="fas fa-user text-gray-400 mr-2"></i>
            Profile Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
            <i className="fas fa-history text-gray-400 mr-2"></i>
            Transaction History
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-white/10" />
          
          <DropdownMenuItem 
            className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400"
            onClick={disconnect}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (connected && !user) {
    // User is connected but hasn't registered username
    return (
      <>
        <Button 
          onClick={() => setShowUsernameModal(true)}
          className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg hover:shadow-[var(--gold)]/50 animate-glow"
        >
          <i className="fas fa-user-edit mr-2"></i>
          Complete Setup
        </Button>
        <UsernameModal 
          isOpen={showUsernameModal} 
          onClose={() => setShowUsernameModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowWalletModal(true)}
        disabled={connecting}
        className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[var(--gold)]/50 transform hover:scale-105 transition-all duration-300 animate-glow"
      >
        <i className="fas fa-wallet mr-2"></i>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </>
  );
}

function getUserGradient(color: string) {
  const gradients = {
    purple: "from-purple-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
    gold: "from-[var(--gold)] to-yellow-400"
  };
  return gradients[color as keyof typeof gradients] || gradients.purple;
}
