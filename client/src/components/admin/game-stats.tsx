import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPercentage, formatSolAmount } from "@/lib/admin-utils";
import type { GameSetting } from "@shared/schema";

export function GameStats() {
  const [editingGame, setEditingGame] = useState<string | null>(null);

  const { data: gameSettings = [], isLoading } = useQuery<GameSetting[]>({
    queryKey: ["/api/admin/game-settings"],
    refetchInterval: 30000
  });

  const gameStats = [
    { 
      name: "Dice", 
      volume24h: "1,247.5", 
      activePlayers: 89, 
      winRate: 48.2,
      totalGames: 2847,
      icon: "fas fa-dice"
    },
    { 
      name: "Coinflip", 
      volume24h: "956.3", 
      activePlayers: 67, 
      winRate: 49.8,
      totalGames: 1923,
      icon: "fas fa-coins"
    },
    { 
      name: "Crash", 
      volume24h: "643.8", 
      activePlayers: 45, 
      winRate: 42.1,
      totalGames: 1156,
      icon: "fas fa-chart-line"
    },
    { 
      name: "Blackjack", 
      volume24h: "423.2", 
      activePlayers: 34, 
      winRate: 45.7,
      totalGames: 892,
      icon: "fas fa-spade"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Game Statistics & Control</h2>
          <p className="text-gray-400">Monitor game performance and adjust settings</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-gamepad text-[var(--gold)]"></i>
              <span className="text-white font-semibold">4</span>
              <span className="text-gray-400 text-sm">Active Games</span>
            </div>
          </div>
          
          <div className="glass-morphism rounded-lg px-4 py-2">
            <div className="flex items-center space-x-2">
              <i className="fas fa-coins text-green-400"></i>
              <span className="text-white font-semibold">3,270.8 SOL</span>
              <span className="text-gray-400 text-sm">24h Volume</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gameStats.map((game, index) => (
          <div key={game.name} className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20 hover:border-[var(--gold)]/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <i className={`${game.icon} text-[var(--gold)] text-xl`}></i>
                <h3 className="font-semibold text-white">{game.name}</h3>
              </div>
              <div className={`w-3 h-3 rounded-full ${index < 2 ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">24h Volume</span>
                <span className="text-sm font-semibold text-[var(--gold)]">{game.volume24h} SOL</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Active Players</span>
                <span className="text-sm font-semibold text-white">{game.activePlayers}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Win Rate</span>
                <span className="text-sm font-semibold text-blue-400">{game.winRate}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Total Games</span>
                <span className="text-sm font-semibold text-white">{game.totalGames.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full text-[var(--gold)] hover:bg-[var(--gold)]/20"
                onClick={() => setEditingGame(editingGame === game.name ? null : game.name)}
              >
                <i className="fas fa-cog mr-2"></i>
                Configure
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Game Settings Configuration */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <i className="fas fa-sliders-h text-[var(--gold)] mr-3"></i>
          Game Settings Configuration
        </h3>
        
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
              <p className="text-gray-400 mt-2">Loading game settings...</p>
            </div>
          ) : (
            gameSettings.map((setting) => (
              <div key={setting.gameType} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-white capitalize">{setting.gameType}</h4>
                    <Switch
                      checked={setting.isEnabled}
                      onCheckedChange={(checked) => {
                        // TODO: Update game enabled status
                      }}
                    />
                    <span className="text-sm text-gray-400">
                      {setting.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Last updated:</span>
                    <span className="text-xs text-white">
                      {setting.updatedAt ? new Date(setting.updatedAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">House Edge (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      defaultValue={setting.houseEdge || "1.5"}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="1.5"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-300 mb-2 block">Playing Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      defaultValue={setting.playingFee || "2.0"}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="2.0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg hover:shadow-[var(--gold)]/50"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Update Settings
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Real-time Chart Placeholder */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <i className="fas fa-chart-area text-[var(--gold)] mr-3"></i>
          Real-time Game Activity
        </h3>
        
        <div className="h-64 flex items-center justify-center bg-[var(--midnight)]/30 rounded-lg border-2 border-dashed border-[var(--gold)]/30">
          <div className="text-center">
            <i className="fas fa-chart-line text-[var(--gold)] text-4xl mb-4"></i>
            <p className="text-white font-semibold">Live Game Analytics</p>
            <p className="text-gray-400 text-sm">Real-time charts and activity monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}