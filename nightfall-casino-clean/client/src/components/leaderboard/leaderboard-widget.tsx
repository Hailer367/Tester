import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

type LeaderboardType = "wins" | "streak" | "volume";

export function LeaderboardWidget() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("wins");

  const { data: leaderboard = [], isLoading } = useQuery<User[]>({
    queryKey: [`/api/leaderboard/${activeTab}`],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getTabLabel = (tab: LeaderboardType) => {
    switch (tab) {
      case "wins": return "Highest Win";
      case "streak": return "Streak";
      case "volume": return "Volume";
    }
  };

  const getDisplayValue = (user: User, type: LeaderboardType) => {
    switch (type) {
      case "wins":
        return `${parseFloat(user.totalWon || "0").toFixed(1)} SOL`;
      case "streak":
        return `${user.maxStreak || 0} wins`;
      case "volume":
        return `${parseFloat(user.totalWagered || "0").toFixed(1)} SOL`;
    }
  };

  const getChangeIndicator = (user: User, type: LeaderboardType) => {
    // Mock percentage changes for display
    const change = (Math.random() - 0.5) * 50;
    const isPositive = change > 0;
    
    return (
      <div className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{change.toFixed(1)}% today
      </div>
    );
  };

  const getUserGradient = (profileColor: string) => {
    const gradients = {
      purple: "from-purple-500 to-pink-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500",
      gold: "from-[var(--gold)] to-yellow-400"
    };
    return gradients[profileColor as keyof typeof gradients] || gradients.purple;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold)] to-yellow-400 flex items-center justify-center text-[var(--midnight)] font-bold text-sm";
    if (index === 1) return "w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm";
    if (index === 2) return "w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm";
    return "w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-sm";
  };

  return (
    <div className="lg:col-span-2 glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <i className="fas fa-trophy text-[var(--gold)] mr-3"></i>
          Leaderboard
        </h3>
        <div className="flex space-x-2">
          {(["wins", "streak", "volume"] as LeaderboardType[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? "bg-[var(--gold)] text-[var(--midnight)] hover:bg-[var(--gold)]/90"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }
            >
              {getTabLabel(tab)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-400 py-8">
            <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p>Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <i className="fas fa-trophy text-2xl mb-2"></i>
            <p>No players yet. Be the first!</p>
          </div>
        ) : (
          leaderboard.slice(0, 10).map((user, index) => (
            <div 
              key={user.id} 
              className="flex items-center justify-between p-3 glass-morphism rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className={getRankBadge(index)}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center">
                    {user.username}
                    {user.currentStreak && user.currentStreak > 3 && (
                      <span className="winning-streak ml-2 text-xs">
                        {user.currentStreak > 10 ? "🔥" : "⚡"}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[var(--gold)]">
                  {getDisplayValue(user, activeTab)}
                </div>
                {getChangeIndicator(user, activeTab)}
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full mt-4 text-[var(--gold)] hover:text-yellow-300 hover:bg-white/5 transition-colors duration-300"
      >
        View Full Leaderboard <i className="fas fa-arrow-right ml-1"></i>
      </Button>
    </div>
  );
}
