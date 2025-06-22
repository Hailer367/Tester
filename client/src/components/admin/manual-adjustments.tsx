import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatWalletAddress, formatSOLAmount } from "@/lib/wallet-utils";
import { getUserRoleColor } from "@/lib/admin-utils";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function ManualAdjustments() {
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutReason, setPayoutReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 30000
  });

  const adjustBalanceMutation = useMutation({
    mutationFn: async ({ userId, amount }: { userId: number; amount: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/balance`, { amount });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowBalanceDialog(false);
      setBalanceAdjustment("");
      setSelectedUser(null);
    }
  });

  const triggerPayoutMutation = useMutation({
    mutationFn: async ({ userId, amount, reason }: { userId: number; amount: string; reason: string }) => {
      const response = await apiRequest("POST", `/api/admin/payouts`, { userId, amount, reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowPayoutDialog(false);
      setPayoutAmount("");
      setPayoutReason("");
      setSelectedUser(null);
    }
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBalanceAdjustment = (user: User) => {
    setSelectedUser(user);
    setShowBalanceDialog(true);
  };

  const handlePayout = (user: User) => {
    setSelectedUser(user);
    setShowPayoutDialog(true);
  };

  const confirmBalanceAdjustment = () => {
    if (!selectedUser || !balanceAdjustment) return;
    
    adjustBalanceMutation.mutate({
      userId: selectedUser.id,
      amount: balanceAdjustment
    });
  };

  const confirmPayout = () => {
    if (!selectedUser || !payoutAmount || !payoutReason) return;
    
    triggerPayoutMutation.mutate({
      userId: selectedUser.id,
      amount: payoutAmount,
      reason: payoutReason
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Manual Adjustments</h2>
          <p className="text-gray-400">Perform manual balance adjustments and payouts</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-exclamation-triangle text-orange-400"></i>
              <span className="text-white font-semibold">Use with Caution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="glass-morphism rounded-xl p-6 border border-orange-500/30">
        <div className="flex items-start space-x-3">
          <i className="fas fa-exclamation-triangle text-orange-400 text-xl mt-1"></i>
          <div>
            <h3 className="text-orange-400 font-semibold mb-2">Important Security Notice</h3>
            <div className="text-gray-300 space-y-2">
              <p>• All manual adjustments are logged and audited</p>
              <p>• Balance changes directly affect user funds</p>
              <p>• Ensure proper authorization before making adjustments</p>
              <p>• Verify user identity and transaction details carefully</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Users */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="mb-4">
          <Label className="text-white font-semibold mb-2 block">Search User for Adjustment</Label>
          <Input
            placeholder="Search by username or wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>

        {/* User Results */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
              <p className="text-gray-400 mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-users text-gray-500 text-2xl"></i>
              <p className="text-gray-400 mt-2">No users found</p>
            </div>
          ) : (
            filteredUsers.slice(0, 10).map((user) => (
              <div key={user.id} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getUserRoleColor(user)} rounded-full flex items-center justify-center text-white font-bold ${user.isAdmin ? 'border-2 border-[var(--gold)]' : ''}`}>
                      {user.isAdmin ? <i className="fas fa-crown text-sm"></i> : user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{user.username}</span>
                        {user.isAdmin && (
                          <Badge className="bg-[var(--gold)] text-[var(--midnight)] text-xs">ADMIN</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        {formatWalletAddress(user.walletAddress)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-[var(--gold)] font-semibold">
                        {formatSOLAmount(user.solBalance || "0")}
                      </div>
                      <div className="text-xs text-gray-400">Current Balance</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleBalanceAdjustment(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Adjust Balance
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => handlePayout(user)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <i className="fas fa-money-bill-wave mr-2"></i>
                        Manual Payout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Balance Adjustment Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent className="glass-morphism border-[var(--gold)]/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-[var(--gold)] flex items-center">
              <i className="fas fa-edit mr-2"></i>
              Adjust User Balance
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-[var(--midnight)]/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getUserRoleColor(selectedUser)} rounded-full flex items-center justify-center text-white font-bold`}>
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedUser.username}</p>
                    <p className="text-sm text-gray-400 font-mono">{formatWalletAddress(selectedUser.walletAddress)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Current Balance: <span className="text-[var(--gold)] font-semibold">{formatSOLAmount(selectedUser.solBalance || "0")}</span>
                </p>
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Adjustment Amount (SOL)</Label>
                <Input
                  type="number"
                  step="0.001"
                  placeholder="Enter positive or negative amount (e.g., -5.0 or +10.0)"
                  value={balanceAdjustment}
                  onChange={(e) => setBalanceAdjustment(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use negative values to subtract, positive to add
                </p>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-orange-300">
                  <i className="fas fa-warning"></i>
                  <span className="font-medium">Confirmation Required</span>
                </div>
                <p className="text-sm text-orange-200 mt-1">
                  This action will be logged and cannot be easily undone. Ensure accuracy before proceeding.
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowBalanceDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBalanceAdjustment}
                  disabled={adjustBalanceMutation.isPending || !balanceAdjustment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {adjustBalanceMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Adjusting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Confirm Adjustment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manual Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent className="glass-morphism border-green-500/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-green-400 flex items-center">
              <i className="fas fa-money-bill-wave mr-2"></i>
              Manual Payout
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-[var(--midnight)]/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getUserRoleColor(selectedUser)} rounded-full flex items-center justify-center text-white font-bold`}>
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedUser.username}</p>
                    <p className="text-sm text-gray-400 font-mono">{formatWalletAddress(selectedUser.walletAddress)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Payout Amount (SOL)</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="Enter payout amount"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <Label className="text-white mb-2 block">Reason for Payout</Label>
                <Select value={payoutReason} onValueChange={setPayoutReason}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical_issue">Technical Issue Compensation</SelectItem>
                    <SelectItem value="promotional_bonus">Promotional Bonus</SelectItem>
                    <SelectItem value="game_malfunction">Game Malfunction Refund</SelectItem>
                    <SelectItem value="goodwill_gesture">Goodwill Gesture</SelectItem>
                    <SelectItem value="other">Other (Custom Reason)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-300">
                  <i className="fas fa-info-circle"></i>
                  <span className="font-medium">Payout Information</span>
                </div>
                <p className="text-sm text-green-200 mt-1">
                  This will add SOL to the user's balance and create an audit log entry.
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowPayoutDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmPayout}
                  disabled={triggerPayoutMutation.isPending || !payoutAmount || !payoutReason}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {triggerPayoutMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Process Payout
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}