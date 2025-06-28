import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Coins, 
  Dice1, 
  ArrowUp, 
  Sparkles, 
  Bomb, 
  Package, 
  Target,
  Users,
  Clock,
  Trophy,
  Star,
  Moon,
  Zap,
  Crown,
  Gamepad2,
  Play,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  players: string;
  minBet: number;
  maxBet?: number;
  gameMode: "1v1" | "group" | "both";
  difficulty: "easy" | "medium" | "hard";
  isEnabled: boolean;
  category: "classic" | "pvp" | "group";
  estimatedTime: string;
  features: string[];
}

const GAME_CONFIGS: GameConfig[] = [
  {
    id: "moon_flip",
    name: "Moon Flip",
    description: "Classic coin flip with anime night theme. Moon vs Star - choose your side!",
    icon: Moon,
    players: "1v1",
    minBet: 0.001,
    gameMode: "1v1",
    difficulty: "easy",
    isEnabled: true,
    category: "classic",
    estimatedTime: "30 seconds",
    features: ["Instant Results", "Fair RNG", "Glowing Effects"]
  },
  {
    id: "dice_duel",
    name: "Dice Duel",
    description: "Roll 1-100, highest wins. Pure luck, maximum excitement!",
    icon: Dice1,
    players: "1v1",
    minBet: 0.001,
    gameMode: "1v1",
    difficulty: "easy",
    isEnabled: true,
    category: "pvp",
    estimatedTime: "45 seconds",
    features: ["High Stakes", "Quick Rounds", "Particle Effects"]
  },
  {
    id: "snake_ladder",
    name: "Snake & Ladder",
    description: "Race to the top! Dodge snakes, climb ladders in this PVP adventure.",
    icon: ArrowUp,
    players: "1v1",
    minBet: 0.002,
    gameMode: "1v1",
    difficulty: "medium",
    isEnabled: true,
    category: "pvp",
    estimatedTime: "2-5 minutes",
    features: ["Turn-Based", "Random Board", "Spectator Mode"]
  },
  {
    id: "wheel_fate",
    name: "Wheel of Fate",
    description: "Mystical wheel with moons, stars, and runes. Fate decides your destiny!",
    icon: Sparkles,
    players: "2-6",
    minBet: 0.001,
    gameMode: "both",
    difficulty: "easy",
    isEnabled: true,
    category: "group",
    estimatedTime: "1 minute",
    features: ["Group Play", "Mystical Theme", "Fair Distribution"]
  },
  {
    id: "mine_flip",
    name: "Mine Flip",
    description: "Find the bomb or avoid it! Psychological thriller meets gambling.",
    icon: Bomb,
    players: "1v1",
    minBet: 0.001,
    gameMode: "1v1",
    difficulty: "medium",
    isEnabled: true,
    category: "pvp",
    estimatedTime: "1 minute",
    features: ["Mind Games", "Slow Reveal", "Cinematic FX"]
  },
  {
    id: "mystery_box",
    name: "Mystery Box Duel",
    description: "Pick the winning box! Only one contains the prize.",
    icon: Package,
    players: "3-5",
    minBet: 0.001,
    gameMode: "group",
    difficulty: "easy",
    isEnabled: true,
    category: "group",
    estimatedTime: "1 minute",
    features: ["Group Decision", "Suspense Build", "Glow Effects"]
  },
  {
    id: "roulette_lite",
    name: "Roulette Lite",
    description: "Simplified 1-12 roulette with glowing numerals and smooth spins.",
    icon: Target,
    players: "2-6",
    minBet: 0.001,
    gameMode: "both",
    difficulty: "easy",
    isEnabled: true,
    category: "classic",
    estimatedTime: "45 seconds",
    features: ["Multiple Players", "Number Betting", "Smooth Animation"]
  }
];

const CATEGORY_ICONS = {
  classic: Crown,
  pvp: Zap,
  group: Users
};

interface GameHubProps {
  onSelectGame: (gameConfig: GameConfig) => void;
  className?: string;
}

export function GameHub({ onSelectGame, className }: GameHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const categories = ["all", "classic", "pvp", "group"];
  
  const filteredGames = selectedCategory === "all" 
    ? GAME_CONFIGS 
    : GAME_CONFIGS.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "medium": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "hard": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Gamepad2 className="h-8 w-8 text-[var(--neon-cyan)]" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-purple-400 bg-clip-text text-transparent">
            Game Hub
          </h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience the thrill of luck-based games in our dreamy night casino. All games are provably fair with Solana blockchain integration.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
          {categories.map((category) => {
            const Icon = category === "all" ? Star : CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                  selectedCategory === category
                    ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="capitalize">{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => {
          const GameIcon = game.icon;
          const CategoryIcon = CATEGORY_ICONS[game.category];
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <Card className={cn(
                "relative overflow-hidden transition-all duration-300 border-gray-700/50 bg-gray-800/30 backdrop-blur-sm",
                "hover:border-[var(--neon-cyan)]/30 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]",
                selectedGame === game.id && "ring-2 ring-[var(--neon-cyan)]/50"
              )}>
                {!game.isEnabled && (
                  <div className="absolute inset-0 bg-gray-900/80 z-10 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Coming Soon</p>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-[var(--neon-cyan)]/20 to-purple-500/20 rounded-lg border border-[var(--neon-cyan)]/20">
                        <GameIcon className="h-6 w-6 text-[var(--neon-cyan)]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-white">{game.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400 capitalize">{game.category}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 text-sm leading-relaxed">
                    {game.description}
                  </CardDescription>

                  {/* Game Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[var(--neon-cyan)]" />
                      <span className="text-gray-300">{game.players}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--neon-cyan)]" />
                      <span className="text-gray-300">{game.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-[var(--gold)]" />
                      <span className="text-gray-300">{game.minBet} SOL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-[var(--gold)]" />
                      <span className="text-gray-300">Winner Takes All</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {game.features.map((feature) => (
                        <Badge 
                          key={feature} 
                          variant="outline" 
                          className="text-xs bg-gray-700/30 border-gray-600/50 text-gray-300"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => {
                      setSelectedGame(game.id);
                      onSelectGame(game);
                    }}
                    disabled={!game.isEnabled}
                    className={cn(
                      "w-full group transition-all duration-300",
                      game.isEnabled 
                        ? "bg-gradient-to-r from-[var(--neon-cyan)] to-purple-500 hover:from-[var(--neon-cyan)]/80 hover:to-purple-500/80 text-black font-semibold"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {game.isEnabled ? "Play Now" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="text-center pt-8 border-t border-gray-700/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--neon-cyan)]">{GAME_CONFIGS.filter(g => g.isEnabled).length}</div>
            <div className="text-xs text-gray-400">Games Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--gold)]">0.0001</div>
            <div className="text-xs text-gray-400">SOL Fee Only</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">100%</div>
            <div className="text-xs text-gray-400">Provably Fair</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">24/7</div>
            <div className="text-xs text-gray-400">Always Open</div>
          </div>
        </div>
      </div>
    </div>
  );
}