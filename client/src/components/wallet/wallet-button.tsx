import { useState } from "react";
import { useWallet } from "./wallet-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatWalletAddress, formatSOLAmount } from "@/lib/wallet-utils";
import { useToast } from "@/hooks/use-toast";

export function WalletButton() {
  const { connected, connecting, publicKey, user, solBalance, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleConnect = async (walletType: string) => {
    try {
      await connect(walletType);
      setIsOpen(false);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Solana wallet!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  if (connected && user) {
    return (
      <div className="flex items-center space-x-4">
        {/* Balance Display */}
        <div className="glass-morphism rounded-lg px-4 py-2 text-sm">
          <div className="text-[var(--gold)] font-semibold">
            {formatSOLAmount(solBalance)} SOL
          </div>
        </div>

        {/* User Info */}
        <div className="glass-morphism rounded-lg px-4 py-2 text-sm">
          <div className="text-white font-medium">{user.username}</div>
          <div className="text-gray-400 text-xs">
            {formatWalletAddress(publicKey?.toString() || "")}
          </div>
        </div>

        {/* Disconnect Button */}
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
          disabled={connecting}
        >
          {connecting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Connecting...
            </>
          ) : (
            <>
              <i className="fas fa-wallet mr-2"></i>
              Connect Wallet
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-morphism border-[var(--gold)]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl font-bold">
            <i className="fas fa-wallet text-[var(--gold)] mr-3"></i>
            Connect Your Wallet
          </DialogTitle>
          <p className="text-gray-400 text-center text-sm mt-2">
            Choose your preferred Solana wallet to start playing
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Phantom Wallet */}
          <Button
            onClick={() => handleConnect("phantom")}
            className="w-full glass-morphism hover:bg-white/10 text-white justify-start h-16"
            variant="ghost"
            disabled={connecting}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-ghost text-white text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-semibold">Phantom</div>
                <div className="text-sm text-gray-400">Popular Solana wallet</div>
              </div>
            </div>
          </Button>

          {/* Solflare Wallet */}
          <Button
            onClick={() => handleConnect("solflare")}
            className="w-full glass-morphism hover:bg-white/10 text-white justify-start h-16"
            variant="ghost"
            disabled={connecting}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-fire text-white text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-semibold">Solflare</div>
                <div className="text-sm text-gray-400">Secure & user-friendly</div>
              </div>
            </div>
          </Button>

          {/* Backpack Wallet */}
          <Button
            onClick={() => handleConnect("backpack")}
            className="w-full glass-morphism hover:bg-white/10 text-white justify-start h-16"
            variant="ghost"
            disabled={connecting}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-backpack text-white text-lg"></i>
              </div>
              <div className="text-left">
                <div className="font-semibold">Backpack</div>
                <div className="text-sm text-gray-400">Multi-chain wallet</div>
              </div>
            </div>
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-blue-400 mt-0.5"></i>
            <div className="text-sm text-blue-300">
              <div className="font-semibold mb-1">New to Solana wallets?</div>
              <div className="text-blue-400">
                We recommend starting with Phantom - it's beginner-friendly and widely supported.
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}