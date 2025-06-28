import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoonFlip } from "./moon-flip";
import { SnakeLadder } from "./snake-ladder";
import { formatWalletAddress } from "@/lib/wallet-utils";

interface GameLobbyProps {
  onGameSelect?: (game: string) => void;
}

export function GameLobby({ onGameSelect }: GameLobbyProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [filterGameType, setFilterGameType] = useState<string>("all");
  const [filterStake, setFilterStake] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch online players count
  const { data: onlineCountData } = useQuery<{ count: number }>({
    queryKey: ["/api/users/online/count"],
    refetchInterval: 30000
  });
  
  const onlineCount = onlineCountData?.count || 0;

  // Mock active games data - in real app this would come from API
  const activeGames = [
    {
      id: 1,
      type: "moon-flip",
      players: ["Player1", "Player2"],
      stake: "0.1",
      status: "playing",
      createdAt: new Date(Date.now() - 300000) // 5 min ago
    },
    {
      id: 2,
      type: "snake-ladder",
      players: ["Player3"],
      stake: "0.05",
      status: "waiting",
      createdAt: new Date(Date.now() - 120000) // 2 min ago
    },
    // Add more mock games as needed
  ];

  const gameTypes = [
    {
      id: "moon-flip",
      name: "Moon Flip",
      icon: "fas fa-moon",
      description: "Flip the cosmic coin",
      minPlayers: 1,
      maxPlayers: 1,
      type: "solo"
    },
    {
      id: "snake-ladder",
      name: "Snake & Ladder",
      icon: "fas fa-dice",
      description: "Race to reach 100",
      minPlayers: 2,
      maxPlayers: 2,
      type: "pvp"
    }
  ];

  const filteredGames = activeGames.filter(game => {
    const matchesType = filterGameType === "all" || game.type === filterGameType;
    const matchesStake = filterStake === "all" || 
      (filterStake === "low" && parseFloat(game.stake) <= 0.01) ||
      (filterStake === "medium" && parseFloat(game.stake) > 0.01 && parseFloat(game.stake) <= 0.1) ||
      (filterStake === "high" && parseFloat(game.stake) > 0.1);
    const matchesSearch = searchTerm === "" || 
      game.players.some(player => player.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesType && matchesStake && matchesSearch;
  });

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    onGameSelect?.(gameId);
  };

  const handleGameComplete = () => {
    // Return to lobby after game completion
    setSelectedGame(null);
  };

  if (selectedGame === "moon-flip") {
    return (
      <div>
        <div className="mb-6 text-center">
          <Button
            onClick={() => setSelectedGame(null)}
            variant="ghost"
            className="text-[var(--gold)] hover:text-yellow-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Game Lobby
          </Button>
        </div>
        <MoonFlip onGameComplete={handleGameComplete} />
      </div>
    );
  }

  if (selectedGame === "snake-ladder") {
    return (
      <div>
        <div className="mb-6 text-center">
          <Button
            onClick={() => setSelectedGame(null)}
            variant="ghost"
            className="text-[var(--gold)] hover:text-yellow-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Game Lobby
          </Button>
        </div>
        <SnakeLadder onGameComplete={handleGameComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Lobby Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <i className="fas fa-gamepad text-[var(--gold)] mr-4"></i>
          Game Lobby
        </h1>
        <p className="text-gray-400 mb-6">Choose your game and test your luck!</p>
        
        {/* Online Players */}
        <div className="glass-morphism rounded-lg px-6 py-3 inline-block">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">{onlineCount || 0}</span>
            <span className="text-gray-400">players online</span>
          </div>
        </div>
      </div>

      {/* Game Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {gameTypes.map((game) => (
          <div
            key={game.id}
            className="glass-morphism rounded-xl p-6 hover:border-[var(--gold)]/50 transition-all duration-300 group cursor-pointer"
            onClick={() => handleGameSelect(game.id)}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--gold)] to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <i className={`${game.icon} text-2xl text-[var(--midnight)]`}></i>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
              <p className="text-gray-400 mb-4">{game.description}</p>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center">
                  <i className="fas fa-users mr-1"></i>
                  {game.minPlayers === game.maxPlayers 
                    ? `${game.minPlayers} player${game.minPlayers > 1 ? 's' : ''}` 
                    : `${game.minPlayers}-${game.maxPlayers} players`
                  }
                </div>
                <Badge className={game.type === "solo" ? "bg-blue-600" : "bg-purple-600"}>
                  {game.type === "solo" ? "Solo" : "PvP"}
                </Badge>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300">
                <i className="fas fa-play mr-2"></i>
                Play Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Games Section */}
      <div className="glass-morphism rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <i className="fas fa-fire text-[var(--gold)] mr-3"></i>
            Active Games
          </h2>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={filterGameType} onValueChange={setFilterGameType}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="moon-flip">Moon Flip</SelectItem>
                <SelectItem value="snake-ladder">Snake & Ladder</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStake} onValueChange={setFilterStake}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stakes</SelectItem>
                <SelectItem value="low">Low (≤0.01)</SelectItem>
                <SelectItem value="medium">Medium (0.01-0.1)</SelectItem>
                <SelectItem value="high">High (&gt;0.1)</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Games List */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-ghost text-gray-500 text-4xl mb-4"></i>
            <h3 className="text-xl text-gray-400 mb-2">No Active Games</h3>
            <p className="text-gray-500">Be the first to start a game!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <div key={game.id} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)] to-yellow-400 rounded-lg flex items-center justify-center">
                      <i className={`${gameTypes.find(gt => gt.id === game.type)?.icon} text-[var(--midnight)]`}></i>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold">
                        {gameTypes.find(gt => gt.id === game.type)?.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>Players: {game.players.map(p => formatWalletAddress(p)).join(", ")}</span>
                        <span>Stake: {game.stake} SOL</span>
                        <span>{Math.floor((Date.now() - game.createdAt.getTime()) / 60000)}m ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={
                      game.status === "waiting" ? "bg-orange-600" :
                      game.status === "playing" ? "bg-green-600" : "bg-gray-600"
                    }>
                      {game.status}
                    </Badge>
                    
                    {game.status === "waiting" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <i className="fas fa-sign-in-alt mr-1"></i>
                        Join
                      </Button>
                    )}
                    
                    {game.status === "playing" && (
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <i className="fas fa-eye mr-1"></i>
                        Spectate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Rules */}
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <i className="fas fa-info-circle text-[var(--gold)] mr-3"></i>
          Game Rules & Limits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="text-white font-semibold mb-2">General Rules</h4>
            <ul className="space-y-1">
              <li>• Maximum 3 active games per player</li>
              <li>• Minimum bet: 0.001 SOL</li>
              <li>• Playing fee: 0.0001 SOL (winner only)</li>
              <li>• All games are luck-based</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-2">Fair Play</h4>
            <ul className="space-y-1">
              <li>• Provably fair randomness</li>
              <li>• No skill components</li>
              <li>• Anti-cheat protection</li>
              <li>• Transparent game logic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}