import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { formatWalletAddress, formatSOLAmount } from "@/lib/wallet-utils";
import { getUserRoleColor } from "@/lib/admin-utils";
import type { User } from "@shared/schema";

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "banned">("all");
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchInterval: 30000
  });

  const banUserMutation = useMutation({
    mutationFn: async ({ userId, banned }: { userId: number; banned: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/ban`, { banned });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    }
  });

  const muteUserMutation = useMutation({
    mutationFn: async ({ userId, muted }: { userId: number; muted: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${userId}/mute`, { muted });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "online") return matchesSearch && user.isOnline;
    if (filterStatus === "banned") return matchesSearch && user.isBanned;
    return matchesSearch;
  });

  const handleBanUser = (userId: number, banned: boolean) => {
    banUserMutation.mutate({ userId, banned });
  };

  const handleMuteUser = (userId: number, muted: boolean) => {
    muteUserMutation.mutate({ userId, muted });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">Monitor and manage all casino users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-users text-[var(--gold)]"></i>
              <span className="text-white font-semibold">{users.length}</span>
              <span className="text-gray-400 text-sm">Total Users</span>
            </div>
          </div>
          
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-circle text-green-400 animate-pulse"></i>
              <span className="text-white font-semibold">{users.filter(u => u.isOnline).length}</span>
              <span className="text-gray-400 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by username or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filterStatus === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={filterStatus === "all" ? "bg-[var(--gold)] text-[var(--midnight)]" : "text-gray-400"}
            >
              All Users
            </Button>
            <Button
              variant={filterStatus === "online" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("online")}
              className={filterStatus === "online" ? "bg-green-600 text-white" : "text-gray-400"}
            >
              Online
            </Button>
            <Button
              variant={filterStatus === "banned" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus("banned")}
              className={filterStatus === "banned" ? "bg-red-600 text-white" : "text-gray-400"}
            >
              Banned
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--midnight)]/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Wallet</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
                    <p className="text-gray-400 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <i className="fas fa-users text-gray-500 text-2xl"></i>
                    <p className="text-gray-400 mt-2">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
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
                            {user.vouchPercentage && parseFloat(user.vouchPercentage) > 0 && (
                              <Badge className="bg-purple-600 text-white text-xs">VIP</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-gray-300">
                        {formatWalletAddress(user.walletAddress)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-[var(--gold)] font-semibold">
                        {formatSOLAmount(user.solBalance || "0")}
                      </div>
                      <div className="text-xs text-gray-400">
                        Wagered: {formatSOLAmount(user.totalWagered || "0")}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                        <span className={`text-sm ${user.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                          {user.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      {user.currentStreak && user.currentStreak > 0 && (
                        <div className="text-xs text-yellow-400">
                          🔥 {user.currentStreak} win streak
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {user.isBanned && (
                          <Badge className="bg-red-600 text-white">Banned</Badge>
                        )}
                        {user.isMuted && (
                          <Badge className="bg-orange-600 text-white">Muted</Badge>
                        )}
                        {!user.isBanned && !user.isMuted && (
                          <Badge className="bg-green-600 text-white">Active</Badge>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isBanned}
                          onCheckedChange={(checked) => handleBanUser(user.id, checked)}
                          disabled={banUserMutation.isPending}
                        />
                        <span className="text-xs text-gray-400">Ban</span>
                        
                        <Switch
                          checked={user.isMuted}
                          onCheckedChange={(checked) => handleMuteUser(user.id, checked)}
                          disabled={muteUserMutation.isPending}
                        />
                        <span className="text-xs text-gray-400">Mute</span>
                        
                        <Button size="sm" variant="ghost" className="text-[var(--gold)] hover:bg-[var(--gold)]/20">
                          <i className="fas fa-cog"></i>
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
    </div>
  );
}