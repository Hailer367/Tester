import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatWalletAddress, formatSOLAmount } from "@/lib/wallet-utils";
import { apiRequest } from "@/lib/queryClient";
import type { FeeWallet } from "@shared/schema";

export function WithdrawalWallets() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [selectedGameTypes, setSelectedGameTypes] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const gameTypes = ["dice", "coinflip", "crash", "blackjack", "roulette", "slots"];

  const { data: feeWallets = [], isLoading } = useQuery<FeeWallet[]>({
    queryKey: ["/api/admin/fee-wallets"],
    refetchInterval: 30000
  });

  const addWalletMutation = useMutation({
    mutationFn: async (walletData: { walletAddress: string; walletName: string; gameTypes: string[] }) => {
      const response = await apiRequest("POST", "/api/admin/fee-wallets", walletData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fee-wallets"] });
      setShowAddDialog(false);
      setNewWalletAddress("");
      setNewWalletName("");
      setSelectedGameTypes([]);
    }
  });

  const updateWalletMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<FeeWallet> }) => {
      const response = await apiRequest("PATCH", `/api/admin/fee-wallets/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fee-wallets"] });
    }
  });

  const deleteWalletMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/fee-wallets/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fee-wallets"] });
    }
  });

  const handleAddWallet = () => {
    if (!newWalletAddress || !newWalletName) return;
    
    addWalletMutation.mutate({
      walletAddress: newWalletAddress,
      walletName: newWalletName,
      gameTypes: selectedGameTypes
    });
  };

  const handleToggleActive = (wallet: FeeWallet) => {
    updateWalletMutation.mutate({
      id: wallet.id,
      updates: { isActive: !wallet.isActive }
    });
  };

  const handleGameTypeToggle = (wallet: FeeWallet, gameType: string) => {
    const currentGameTypes = wallet.gameTypes || [];
    const newGameTypes = currentGameTypes.includes(gameType)
      ? currentGameTypes.filter(gt => gt !== gameType)
      : [...currentGameTypes, gameType];
    
    updateWalletMutation.mutate({
      id: wallet.id,
      updates: { gameTypes: newGameTypes }
    });
  };

  const handleDeleteWallet = (id: number) => {
    if (confirm("Are you sure you want to delete this fee wallet? This action cannot be undone.")) {
      deleteWalletMutation.mutate(id);
    }
  };

  const totalCollected = feeWallets.reduce((sum, wallet) => sum + parseFloat(wallet.totalCollected || "0"), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Fee Collection Wallets</h2>
          <p className="text-gray-400">Manage wallets that collect fees from winning games</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-coins text-[var(--gold)]"></i>
              <span className="text-white font-semibold">{formatSOLAmount(totalCollected.toString())}</span>
              <span className="text-gray-400 text-sm">Total Collected</span>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg hover:shadow-[var(--gold)]/50"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Fee Wallet
          </Button>
        </div>
      </div>

      {/* Wallet Limit Notice */}
      <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/30">
        <div className="flex items-start space-x-3">
          <i className="fas fa-info-circle text-[var(--gold)] text-xl mt-1"></i>
          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-2">Fee Wallet Information</h3>
            <div className="text-gray-300 space-y-1">
              <p>• Maximum of 3 fee wallets can be configured</p>
              <p>• Fees are only collected from winning players</p>
              <p>• Each wallet can be assigned to specific games</p>
              <p>• Inactive wallets will not collect fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Wallets List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="glass-morphism rounded-xl p-12 text-center">
            <i className="fas fa-spinner fa-spin text-[var(--gold)] text-3xl mb-4"></i>
            <p className="text-gray-400">Loading fee wallets...</p>
          </div>
        ) : feeWallets.length === 0 ? (
          <div className="glass-morphism rounded-xl p-12 text-center">
            <i className="fas fa-wallet text-gray-500 text-4xl mb-4"></i>
            <h3 className="text-white font-semibold mb-2">No Fee Wallets Configured</h3>
            <p className="text-gray-400 mb-6">Add fee wallets to start collecting fees from winning games</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)]"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Your First Wallet
            </Button>
          </div>
        ) : (
          feeWallets.map((wallet) => (
            <div key={wallet.id} className="glass-morphism rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${wallet.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                    <i className={`fas ${wallet.isActive ? 'fa-wallet' : 'fa-pause'} text-white`}></i>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-white font-semibold text-lg">{wallet.walletName}</h3>
                      <Badge className={wallet.isActive ? "bg-green-600" : "bg-gray-600"}>
                        {wallet.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-gray-400 font-mono text-sm">{formatWalletAddress(wallet.walletAddress, 8)}</p>
                    <p className="text-[var(--gold)] font-semibold">
                      Collected: {formatSOLAmount(wallet.totalCollected || "0")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm text-gray-400">Active</Label>
                    <Switch
                      checked={wallet.isActive}
                      onCheckedChange={() => handleToggleActive(wallet)}
                      disabled={updateWalletMutation.isPending}
                    />
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteWallet(wallet.id)}
                    disabled={deleteWalletMutation.isPending}
                    className="text-red-400 hover:bg-red-400/20"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="text-white font-medium mb-3 block">Assigned Game Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gameTypes.map((gameType) => (
                    <div key={gameType} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${wallet.id}-${gameType}`}
                        checked={(wallet.gameTypes || []).includes(gameType)}
                        onCheckedChange={() => handleGameTypeToggle(wallet, gameType)}
                        disabled={updateWalletMutation.isPending || !wallet.isActive}
                      />
                      <Label 
                        htmlFor={`${wallet.id}-${gameType}`}
                        className={`text-sm capitalize ${wallet.isActive ? 'text-white' : 'text-gray-500'}`}
                      >
                        {gameType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Wallet Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="glass-morphism border-[var(--gold)]/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-[var(--gold)] flex items-center">
              <i className="fas fa-plus mr-2"></i>
              Add Fee Collection Wallet
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Wallet Limit Check */}
            {feeWallets.length >= 3 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-300">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span className="font-medium">Wallet Limit Reached</span>
                </div>
                <p className="text-sm text-red-200 mt-1">
                  Maximum of 3 fee wallets allowed. Remove an existing wallet to add a new one.
                </p>
              </div>
            )}
            
            <div>
              <Label className="text-white mb-2 block">Wallet Name</Label>
              <Input
                placeholder="Enter descriptive wallet name..."
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Wallet Address</Label>
              <Input
                placeholder="Enter Solana wallet address..."
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 font-mono"
              />
            </div>
            
            <div>
              <Label className="text-white mb-3 block">Assign to Game Types</Label>
              <div className="grid grid-cols-2 gap-3">
                {gameTypes.map((gameType) => (
                  <div key={gameType} className="flex items-center space-x-2">
                    <Checkbox
                      id={`new-${gameType}`}
                      checked={selectedGameTypes.includes(gameType)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedGameTypes(prev => [...prev, gameType]);
                        } else {
                          setSelectedGameTypes(prev => prev.filter(gt => gt !== gameType));
                        }
                      }}
                    />
                    <Label htmlFor={`new-${gameType}`} className="text-sm text-white capitalize">
                      {gameType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-[var(--gold)]">
                <i className="fas fa-info-circle"></i>
                <span className="font-medium">Fee Collection Info</span>
              </div>
              <p className="text-sm text-yellow-200 mt-1">
                This wallet will automatically collect fees from selected games when players win.
              </p>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddWallet}
                disabled={addWalletMutation.isPending || !newWalletAddress || !newWalletName || feeWallets.length >= 3}
                className="flex-1 bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)]"
              >
                {addWalletMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus mr-2"></i>
                    Add Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}