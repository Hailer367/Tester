import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatWalletAddress, formatSOLAmount } from "@/lib/wallet-utils";
import { getUserRoleColor } from "@/lib/admin-utils";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function LeaderboardControl() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"wins" | "streak" | "volume">("wins");
  const queryClient = useQueryClient();

  const { data: leaderboard = [], isLoading } = useQuery<User[]>({
    queryKey: [`/api/leaderboard/${activeTab}`],
    refetchInterval: 30000
  });

  const resetLeaderboardMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest("POST", `/api/admin/leaderboard/reset`, { type });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/leaderboard/${activeTab}`] });
      setShowResetDialog(false);
    }
  });

  const flagUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/flag`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/leaderboard/${activeTab}`] });
    }
  });

  const getDisplayValue = (user: User, type: "wins" | "streak" | "volume") => {
    switch (type) {
      case "wins":
        return formatSOLAmount(user.totalWon || "0");
      case "streak":
        return `${user.maxStreak || 0} wins`;
      case "volume":
        return formatSOLAmount(user.totalWagered || "0");
    }
  };

  const getTabLabel = (tab: "wins" | "streak" | "volume") => {
    switch (tab) {
      case "wins": return "Highest Wins";
      case "streak": return "Win Streaks";
      case "volume": return "Volume";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Control</h2>
          <p className="text-gray-400">Monitor and manage leaderboard rankings</p>
        </div>
        
        <Button
          onClick={() => setShowResetDialog(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <i className="fas fa-trash mr-2"></i>
          Reset Leaderboard
        </Button>
      </div>

      {/* Leaderboard Tabs */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex space-x-4 mb-6">
          {(["wins", "streak", "volume"] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "bg-[var(--gold)] text-[var(--midnight)] hover:bg-[var(--gold)]/90"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }
            >
              <i className={`fas ${tab === 'wins' ? 'fa-trophy' : tab === 'streak' ? 'fa-fire' : 'fa-chart-bar'} mr-2`}></i>
              {getTabLabel(tab)}
            </Button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--midnight)]/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Player</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
                    <p className="text-gray-400 mt-2">Loading leaderboard...</p>
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <i className="fas fa-trophy text-gray-500 text-2xl"></i>
                    <p className="text-gray-400 mt-2">No entries found</p>
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, index) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-[var(--gold)] to-yellow-400' :
                          index === 1 ? 'bg-gray-600' :
                          index === 2 ? 'bg-amber-600' : 'bg-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <i className={`fas ${index === 0 ? 'fa-crown' : index === 1 ? 'fa-medal' : 'fa-award'} text-${index === 0 ? '[var(--gold)]' : index === 1 ? 'gray-400' : 'amber-500'}`}></i>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
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
                            {user.currentStreak && user.currentStreak > 5 && (
                              <span className="text-yellow-400 text-sm">🔥</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            {formatWalletAddress(user.walletAddress)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-[var(--gold)] font-bold text-lg">
                        {getDisplayValue(user, activeTab)}
                      </div>
                      {activeTab === "wins" && (
                        <div className="text-xs text-gray-400">
                          From {formatSOLAmount(user.totalWagered || "0")} wagered
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      {user.isBanned && (
                        <Badge className="bg-red-600 text-white text-xs mt-1">Banned</Badge>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => flagUserMutation.mutate(user.id)}
                          disabled={flagUserMutation.isPending}
                          className="text-orange-400 hover:bg-orange-400/20"
                        >
                          <i className="fas fa-flag"></i>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[var(--gold)] hover:bg-[var(--gold)]/20"
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Top Performer</h3>
            <i className="fas fa-crown text-[var(--gold)]"></i>
          </div>
          {leaderboard[0] && (
            <div className="space-y-2">
              <p className="text-[var(--gold)] font-bold">{leaderboard[0].username}</p>
              <p className="text-sm text-gray-400">{getDisplayValue(leaderboard[0], activeTab)}</p>
            </div>
          )}
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Competition Level</h3>
            <i className="fas fa-chart-line text-green-400"></i>
          </div>
          <div className="space-y-2">
            <p className="text-green-400 font-bold">High</p>
            <p className="text-sm text-gray-400">{leaderboard.length} active competitors</p>
          </div>
        </div>
        
        <div className="glass-morphism rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Last Reset</h3>
            <i className="fas fa-history text-blue-400"></i>
          </div>
          <div className="space-y-2">
            <p className="text-blue-400 font-bold">7 days ago</p>
            <p className="text-sm text-gray-400">Weekly reset cycle</p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="glass-morphism border-red-500/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Reset Leaderboard
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Are you sure you want to reset the <strong>{getTabLabel(activeTab)}</strong> leaderboard? 
              This action cannot be undone and will clear all current rankings.
            </p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-300">
                <i className="fas fa-warning"></i>
                <span className="font-medium">This action is irreversible</span>
              </div>
              <p className="text-sm text-red-200 mt-1">
                All player rankings and statistics for this category will be permanently removed.
              </p>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowResetDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => resetLeaderboardMutation.mutate(activeTab)}
                disabled={resetLeaderboardMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {resetLeaderboardMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Reset Leaderboard
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