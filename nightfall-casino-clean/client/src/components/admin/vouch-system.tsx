import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { formatWalletAddress } from "@/lib/wallet-utils";
import { getUserRoleColor } from "@/lib/admin-utils";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function VouchSystem() {
  const [showVouchDialog, setShowVouchDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [vouchPercentage, setVouchPercentage] = useState([0]);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 30000
  });

  const updateVouchMutation = useMutation({
    mutationFn: async ({ userId, percentage }: { userId: number; percentage: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/vouch`, { percentage });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowVouchDialog(false);
      setSelectedUser(null);
      setVouchPercentage([0]);
    }
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vouchedUsers = users.filter(user => 
    user.vouchPercentage && parseFloat(user.vouchPercentage) > 0
  ).sort((a, b) => parseFloat(b.vouchPercentage || "0") - parseFloat(a.vouchPercentage || "0"));

  const handleVouchUser = (user: User) => {
    setSelectedUser(user);
    const currentVouch = user.vouchPercentage ? parseFloat(user.vouchPercentage) : 0;
    setVouchPercentage([currentVouch]);
    setShowVouchDialog(true);
  };

  const confirmVouch = () => {
    if (!selectedUser) return;
    
    updateVouchMutation.mutate({
      userId: selectedUser.id,
      percentage: vouchPercentage[0].toString()
    });
  };

  const getVouchLevel = (percentage: number): { label: string; color: string } => {
    if (percentage === 0) return { label: "None", color: "bg-gray-600" };
    if (percentage <= 5) return { label: "Bronze", color: "bg-amber-700" };
    if (percentage <= 10) return { label: "Silver", color: "bg-gray-500" };
    if (percentage <= 20) return { label: "Gold", color: "bg-yellow-600" };
    if (percentage <= 35) return { label: "Platinum", color: "bg-blue-600" };
    return { label: "Diamond", color: "bg-purple-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Vouch System</h2>
          <p className="text-gray-400">Secretly increase win chances for selected players</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-star text-[var(--gold)]"></i>
              <span className="text-white font-semibold">{vouchedUsers.length}</span>
              <span className="text-gray-400 text-sm">Vouched Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/30">
        <div className="flex items-start space-x-3">
          <i className="fas fa-eye-slash text-[var(--gold)] text-xl mt-1"></i>
          <div>
            <h3 className="text-[var(--gold)] font-semibold mb-2">Vouch System Information</h3>
            <div className="text-gray-300 space-y-1">
              <p>• Vouching secretly increases a player's win probability</p>
              <p>• Vouch percentages are hidden from all users</p>
              <p>• Higher percentages give better win chances</p>
              <p>• Use responsibly to maintain game integrity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Vouched Users */}
      {vouchedUsers.length > 0 && (
        <div className="glass-morphism rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <i className="fas fa-crown text-[var(--gold)] mr-3"></i>
            Currently Vouched Players
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchedUsers.map((user) => {
              const vouchLevel = getVouchLevel(parseFloat(user.vouchPercentage || "0"));
              return (
                <div key={user.id} className="bg-[var(--midnight)]/30 rounded-lg p-4 border border-[var(--gold)]/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getUserRoleColor(user)} rounded-full flex items-center justify-center text-white font-bold border-2 border-[var(--gold)]`}>
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{user.username}</span>
                        <Badge className={`${vouchLevel.color} text-white text-xs`}>
                          {vouchLevel.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        {formatWalletAddress(user.walletAddress)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[var(--gold)] font-bold text-lg">
                        +{parseFloat(user.vouchPercentage || "0").toFixed(1)}%
                      </span>
                      <p className="text-xs text-gray-400">Win Boost</p>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleVouchUser(user)}
                      className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg"
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Users to Vouch */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <i className="fas fa-search text-[var(--gold)] mr-3"></i>
          Search Users to Vouch
        </h3>
        
        <div className="mb-4">
          <Input
            placeholder="Search by username or wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400"
          />
        </div>

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
            filteredUsers.slice(0, 10).map((user) => {
              const currentVouch = parseFloat(user.vouchPercentage || "0");
              const vouchLevel = getVouchLevel(currentVouch);
              
              return (
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
                          {currentVouch > 0 && (
                            <Badge className={`${vouchLevel.color} text-white text-xs`}>
                              {vouchLevel.label}
                            </Badge>
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
                          {currentVouch > 0 ? `+${currentVouch.toFixed(1)}%` : "No Vouch"}
                        </div>
                        <div className="text-xs text-gray-400">Current Boost</div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleVouchUser(user)}
                        className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg"
                      >
                        <i className="fas fa-star mr-2"></i>
                        {currentVouch > 0 ? "Edit" : "Vouch"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Vouch Dialog */}
      <Dialog open={showVouchDialog} onOpenChange={setShowVouchDialog}>
        <DialogContent className="glass-morphism border-[var(--gold)]/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-[var(--gold)] flex items-center">
              <i className="fas fa-star mr-2"></i>
              Set Vouch Percentage
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
                <Label className="text-white mb-4 block">
                  Win Chance Boost: <span className="text-[var(--gold)] font-bold">{vouchPercentage[0].toFixed(1)}%</span>
                </Label>
                <Slider
                  value={vouchPercentage}
                  onValueChange={setVouchPercentage}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
              
              <div className="bg-[var(--midnight)]/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Vouch Level:</span>
                  <Badge className={`${getVouchLevel(vouchPercentage[0]).color} text-white`}>
                    {getVouchLevel(vouchPercentage[0]).label}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-orange-300">
                  <i className="fas fa-eye-slash"></i>
                  <span className="font-medium">Secret Operation</span>
                </div>
                <p className="text-sm text-orange-200 mt-1">
                  This boost is completely hidden from the user and other players. Use ethically.
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowVouchDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmVouch}
                  disabled={updateVouchMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)]"
                >
                  {updateVouchMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Set Vouch
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