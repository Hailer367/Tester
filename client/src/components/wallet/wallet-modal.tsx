import { useState } from "react";
import { useWallet } from "./wallet-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connect } = useWallet();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  const wallets = [
    {
      id: "phantom",
      name: "Phantom Wallet",
      icon: "fab fa-fantasy-flight-games",
      color: "bg-purple-600",
      detected: detectWallet("phantom")
    },
    {
      id: "backpack",
      name: "Backpack",
      icon: "fas fa-backpack",
      color: "bg-orange-600",
      detected: detectWallet("backpack")
    },
    {
      id: "solflare",
      name: "Solflare",
      icon: "fas fa-fire",
      color: "bg-yellow-600",
      detected: detectWallet("solflare")
    }
  ];

  function detectWallet(walletType: string) {
    switch (walletType) {
      case "phantom":
        return !!(window as any).solana?.isPhantom;
      case "backpack":
        return !!(window as any).backpack?.isBackpack;
      case "solflare":
        return !!(window as any).solflare?.isSolflare;
      default:
        return false;
    }
  }

  const handleConnect = async (walletId: string, detected: boolean) => {
    if (!detected) {
      toast({
        title: "Wallet not detected",
        description: `Please install ${wallets.find(w => w.id === walletId)?.name} extension first.`,
        variant: "destructive"
      });
      return;
    }

    setConnecting(walletId);
    
    try {
      await connect(walletId);
      onClose();
      toast({
        title: "Wallet connected successfully",
        description: "Welcome to Nightfall Casino!",
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-[var(--gold)]/30 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-3">
            <i className="fas fa-wallet text-4xl text-[var(--gold)]"></i>
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            Connect Your Wallet
          </DialogTitle>
          <p className="text-gray-400">Choose your preferred Solana wallet to get started</p>
        </DialogHeader>

        <div className="space-y-3 mt-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id, wallet.detected)}
              disabled={connecting === wallet.id}
              className="w-full glass-morphism rounded-lg p-4 flex items-center space-x-4 hover:border-[var(--gold)]/50 hover:bg-white/5 transition-all duration-300 group disabled:opacity-50"
            >
              <div className={`w-12 h-12 ${wallet.color} rounded-lg flex items-center justify-center`}>
                <i className={`${wallet.icon} text-white text-xl`}></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-white group-hover:text-[var(--gold)] transition-colors duration-300">
                  {wallet.name}
                </div>
                <div className="text-sm text-gray-400">
                  {wallet.detected ? "Detected" : "Not Detected"}
                </div>
              </div>
              {connecting === wallet.id ? (
                <i className="fas fa-spinner fa-spin text-[var(--gold)]"></i>
              ) : wallet.detected ? (
                <i className="fas fa-arrow-right text-gray-400 group-hover:text-[var(--gold)] transition-colors duration-300"></i>
              ) : (
                <i className="fas fa-external-link-alt text-gray-400 group-hover:text-[var(--gold)] transition-colors duration-300"></i>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fas fa-times mr-2"></i>
            Close
          </Button>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-start space-x-3">
            <i className="fas fa-info-circle text-blue-400 mt-1"></i>
            <div className="text-sm text-blue-200">
              <p className="font-medium mb-1">New to Solana wallets?</p>
              <p className="text-blue-300">
                Wallets allow you to securely store and manage your SOL and other tokens. 
                Your private keys never leave your device.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
