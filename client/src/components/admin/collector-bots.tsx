import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Eye, 
  DollarSign,
  Clock,
  Gamepad2,
  Shield,
  User,
  Wallet,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CollectorBot {
  id: string;
  username: string;
  profilePicture: string;
  walletAddress: string;
  allowedGames: string[];
  winProbability: number;
  gameInterval: number;
  canPlayMultiple: boolean;
  minStakeSOL: number;
  maxStakeSOL: number;
  canBuyShopItems: boolean;
  allowedShopItems: string[];
  ghostMode: boolean;
  botType: "COLLECTOR" | "MILE_COLLECTOR";
  isActive: boolean;
  activeSchedule?: string;
  createdBy: string;
  createdAt: string;
  stats: {
    gamesPlayed: number;
    totalWagered: number;
    totalWon: number;
    winRate: number;
  };
}

interface CollectorBotsProps {
  adminWallet: string;
}

const demoCollectorBots: CollectorBot[] = [
  {
    id: "bot-1",
    username: "NightHunter_AI",
    profilePicture: "🤖",
    walletAddress: "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
    allowedGames: ["moon-flip", "snake-ladder"],
    winProbability: 45,
    gameInterval: 5,
    canPlayMultiple: false,
    minStakeSOL: 0.1,
    maxStakeSOL: 1.0,
    canBuyShopItems: false,
    allowedShopItems: [],
    ghostMode: false,
    botType: "COLLECTOR",
    isActive: true,
    createdBy: "GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb",
    createdAt: "2025-06-28T10:30:00Z",
    stats: {
      gamesPlayed: 127,
      totalWagered: 45.7,
      totalWon: 23.1,
      winRate: 44.2
    }
  },
  {
    id: "bot-2", 
    username: "MidnightOracle",
    profilePicture: "🔮",
    walletAddress: "B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0A1",
    allowedGames: ["moon-flip"],
    winProbability: 60,
    gameInterval: 10,
    canPlayMultiple: true,
    minStakeSOL: 0.5,
    maxStakeSOL: 2.0,
    canBuyShopItems: true,
    allowedShopItems: ["borders", "effects"],
    ghostMode: true,
    botType: "MILE_COLLECTOR",
    isActive: false,
    activeSchedule: "00:00-06:00,22:00-23:59",
    createdBy: "GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb",
    createdAt: "2025-06-27T15:45:00Z",
    stats: {
      gamesPlayed: 89,
      totalWagered: 67.3,
      totalWon: 41.8,
      winRate: 61.2
    }
  }
];

export function CollectorBots({ adminWallet }: CollectorBotsProps) {
  const [bots, setBots] = useState<CollectorBot[]>(demoCollectorBots);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<CollectorBot | null>(null);
  const [newBot, setNewBot] = useState({
    username: "",
    profilePicture: "",
    walletPrivateKey: "",
    allowedGames: [] as string[],
    winProbability: 50,
    gameInterval: 5,
    canPlayMultiple: false,
    minStakeSOL: 0.1,
    maxStakeSOL: 1.0,
    canBuyShopItems: false,
    allowedShopItems: [] as string[],
    ghostMode: false,
    botType: "COLLECTOR" as "COLLECTOR" | "MILE_COLLECTOR",
    activeSchedule: ""
  });
  const { toast } = useToast();

  const gameOptions = [
    { value: "moon-flip", label: "Moon Flip" },
    { value: "snake-ladder", label: "Snake & Ladder" },
    { value: "dice-duel", label: "Dice Duel" }
  ];

  const shopCategories = [
    { value: "titles", label: "Titles" },
    { value: "borders", label: "Borders" },
    { value: "sounds", label: "Sound Packs" },
    { value: "effects", label: "Avatar Effects" },
    { value: "coins", label: "Coin Skins" }
  ];

  const handleCreateBot = () => {
    const bot: CollectorBot = {
      id: `bot-${Date.now()}`,
      username: newBot.username,
      profilePicture: newBot.profilePicture || "🤖",
      walletAddress: "Generated from private key", // In real implementation, derive from private key
      allowedGames: newBot.allowedGames,
      winProbability: newBot.winProbability,
      gameInterval: newBot.gameInterval,
      canPlayMultiple: newBot.canPlayMultiple,
      minStakeSOL: newBot.minStakeSOL,
      maxStakeSOL: newBot.maxStakeSOL,
      canBuyShopItems: newBot.canBuyShopItems,
      allowedShopItems: newBot.allowedShopItems,
      ghostMode: newBot.ghostMode,
      botType: newBot.botType,
      isActive: false,
      activeSchedule: newBot.activeSchedule || undefined,
      createdBy: adminWallet,
      createdAt: new Date().toISOString(),
      stats: {
        gamesPlayed: 0,
        totalWagered: 0,
        totalWon: 0,
        winRate: 0
      }
    };

    setBots([...bots, bot]);
    setIsCreateModalOpen(false);
    setNewBot({
      username: "",
      profilePicture: "",
      walletPrivateKey: "",
      allowedGames: [],
      winProbability: 50,
      gameInterval: 5,
      canPlayMultiple: false,
      minStakeSOL: 0.1,
      maxStakeSOL: 1.0,
      canBuyShopItems: false,
      allowedShopItems: [],
      ghostMode: false,
      botType: "COLLECTOR",
      activeSchedule: ""
    });

    toast({
      title: "COLLECTOR Created",
      description: `${bot.username} has been created successfully`,
    });
  };

  const toggleBotActive = (botId: string) => {
    setBots(bots.map(bot => 
      bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
    ));
    
    const bot = bots.find(b => b.id === botId);
    toast({
      title: bot?.isActive ? "COLLECTOR Deactivated" : "COLLECTOR Activated",
      description: `${bot?.username} is now ${bot?.isActive ? "inactive" : "active"}`,
    });
  };

  const deleteBot = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    setBots(bots.filter(b => b.id !== botId));
    toast({
      title: "COLLECTOR Deleted",
      description: `${bot?.username} has been permanently removed`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-[var(--gold)] to-amber-500 rounded-lg">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">COLLECTOR Management</h2>
            <p className="text-[var(--muted-foreground)]">Create and manage automated gambling bots</p>
          </div>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black">
              <Plus className="w-4 h-4 mr-2" />
              Make a COLLECTOR
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-[var(--card)] border-[var(--border)] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--gold)]" />
                Create New COLLECTOR
              </DialogTitle>
              <DialogDescription>
                Configure a new automated bot to participate in games
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bot-username">Bot Username</Label>
                    <Input
                      id="bot-username"
                      value={newBot.username}
                      onChange={(e) => setNewBot({...newBot, username: e.target.value})}
                      placeholder="Enter bot username"
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bot-pfp">Profile Picture (Emoji)</Label>
                    <Input
                      id="bot-pfp"
                      value={newBot.profilePicture}
                      onChange={(e) => setNewBot({...newBot, profilePicture: e.target.value})}
                      placeholder="🤖"
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Wallet Configuration</h3>
                <div>
                  <Label htmlFor="private-key">Private Key (Encrypted)</Label>
                  <Textarea
                    id="private-key"
                    value={newBot.walletPrivateKey}
                    onChange={(e) => setNewBot({...newBot, walletPrivateKey: e.target.value})}
                    placeholder="Enter wallet private key (will be encrypted)"
                    className="bg-[var(--background)] border-[var(--border)]"
                  />
                </div>
              </div>

              {/* Game Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Game Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Allowed Games</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gameOptions.map((game) => (
                        <div key={game.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`game-${game.value}`}
                            checked={newBot.allowedGames.includes(game.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewBot({...newBot, allowedGames: [...newBot.allowedGames, game.value]});
                              } else {
                                setNewBot({...newBot, allowedGames: newBot.allowedGames.filter(g => g !== game.value)});
                              }
                            }}
                            className="rounded border-[var(--border)]"
                          />
                          <Label htmlFor={`game-${game.value}`} className="text-sm">{game.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="win-prob">Win Probability (%)</Label>
                      <Input
                        id="win-prob"
                        type="number"
                        min="0"
                        max="100"
                        value={newBot.winProbability}
                        onChange={(e) => setNewBot({...newBot, winProbability: Number(e.target.value)})}
                        className="bg-[var(--background)] border-[var(--border)]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="game-interval">Game Interval (minutes)</Label>
                      <Input
                        id="game-interval"
                        type="number"
                        min="1"
                        value={newBot.gameInterval}
                        onChange={(e) => setNewBot({...newBot, gameInterval: Number(e.target.value)})}
                        className="bg-[var(--background)] border-[var(--border)]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="can-play-multiple"
                      checked={newBot.canPlayMultiple}
                      onCheckedChange={(checked) => setNewBot({...newBot, canPlayMultiple: checked})}
                    />
                    <Label htmlFor="can-play-multiple">Can play multiple games simultaneously</Label>
                  </div>
                </div>
              </div>

              {/* SOL Range */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Stake Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-stake">Minimum Stake (SOL)</Label>
                    <Input
                      id="min-stake"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newBot.minStakeSOL}
                      onChange={(e) => setNewBot({...newBot, minStakeSOL: Number(e.target.value)})}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-stake">Maximum Stake (SOL)</Label>
                    <Input
                      id="max-stake"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newBot.maxStakeSOL}
                      onChange={(e) => setNewBot({...newBot, maxStakeSOL: Number(e.target.value)})}
                      className="bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                </div>
              </div>

              {/* Shop Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Shop Permissions</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="can-buy-shop"
                    checked={newBot.canBuyShopItems}
                    onCheckedChange={(checked) => setNewBot({...newBot, canBuyShopItems: checked})}
                  />
                  <Label htmlFor="can-buy-shop">Allow shop purchases</Label>
                </div>

                {newBot.canBuyShopItems && (
                  <div>
                    <Label>Allowed Shop Categories</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {shopCategories.map((category) => (
                        <div key={category.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`shop-${category.value}`}
                            checked={newBot.allowedShopItems.includes(category.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewBot({...newBot, allowedShopItems: [...newBot.allowedShopItems, category.value]});
                              } else {
                                setNewBot({...newBot, allowedShopItems: newBot.allowedShopItems.filter(s => s !== category.value)});
                              }
                            }}
                            className="rounded border-[var(--border)]"
                          />
                          <Label htmlFor={`shop-${category.value}`} className="text-sm">{category.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bot Type & Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[var(--foreground)]">Bot Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bot-type">Bot Type</Label>
                    <Select value={newBot.botType} onValueChange={(value: "COLLECTOR" | "MILE_COLLECTOR") => setNewBot({...newBot, botType: value})}>
                      <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COLLECTOR">COLLECTOR</SelectItem>
                        <SelectItem value="MILE_COLLECTOR">MILE COLLECTOR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ghost-mode"
                      checked={newBot.ghostMode}
                      onCheckedChange={(checked) => setNewBot({...newBot, ghostMode: checked})}
                    />
                    <Label htmlFor="ghost-mode">Ghost Mode (hidden from public)</Label>
                  </div>

                  {newBot.botType === "MILE_COLLECTOR" && (
                    <div>
                      <Label htmlFor="active-schedule">Active Schedule (HH:MM-HH:MM, comma separated)</Label>
                      <Input
                        id="active-schedule"
                        value={newBot.activeSchedule}
                        onChange={(e) => setNewBot({...newBot, activeSchedule: e.target.value})}
                        placeholder="00:00-06:00,22:00-23:59"
                        className="bg-[var(--background)] border-[var(--border)]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateBot}
                disabled={!newBot.username || !newBot.walletPrivateKey || newBot.allowedGames.length === 0}
                className="bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black"
              >
                Create COLLECTOR
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-[var(--gold)]" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Total Bots</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{bots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Play className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Active Bots</p>
                <p className="text-2xl font-bold text-green-400">{bots.filter(b => b.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-[var(--primary)]" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Total Wagered</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {bots.reduce((sum, bot) => sum + bot.stats.totalWagered, 0).toFixed(2)} SOL
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-[var(--neon-cyan)]" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Games Played</p>
                <p className="text-2xl font-bold text-[var(--neon-cyan)]">
                  {bots.reduce((sum, bot) => sum + bot.stats.gamesPlayed, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bots List */}
      <div className="space-y-4">
        {bots.map((bot) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-6 bg-[var(--card)]/50 border rounded-lg transition-all duration-300",
              bot.isActive ? "border-green-500/30 bg-green-500/5" : "border-[var(--border)]"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Bot Avatar with Golden Halo for admins */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold)] to-amber-500 rounded-lg flex items-center justify-center text-lg">
                    {bot.profilePicture}
                  </div>
                  {/* Golden Halo - visible only to admins */}
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[var(--gold)] via-amber-400 to-[var(--gold)] opacity-30 blur-sm" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[var(--foreground)]">{bot.username}</h3>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      bot.botType === "MILE_COLLECTOR" ? "border-purple-500 text-purple-400" : "border-[var(--gold)] text-[var(--gold)]"
                    )}>
                      {bot.botType.replace("_", " ")}
                    </Badge>
                    {bot.ghostMode && (
                      <Badge variant="outline" className="border-gray-500 text-gray-400">
                        <Eye className="w-3 h-3 mr-1" />
                        Ghost
                      </Badge>
                    )}
                    {bot.isActive && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--muted-foreground)]">Games Played</p>
                      <p className="font-medium text-[var(--foreground)]">{bot.stats.gamesPlayed}</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Win Rate</p>
                      <p className="font-medium text-[var(--foreground)]">{bot.stats.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Total Wagered</p>
                      <p className="font-medium text-[var(--primary)]">{bot.stats.totalWagered.toFixed(2)} SOL</p>
                    </div>
                    <div>
                      <p className="text-[var(--muted-foreground)]">Stake Range</p>
                      <p className="font-medium text-[var(--foreground)]">{bot.minStakeSOL}-{bot.maxStakeSOL} SOL</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bot.allowedGames.map((game) => (
                      <Badge key={game} variant="secondary" className="text-xs">
                        {game.replace("-", " ").toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBot(bot)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                <Button
                  variant={bot.isActive ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleBotActive(bot.id)}
                  className={bot.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {bot.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteBot(bot.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {bots.length === 0 && (
          <Card className="bg-[var(--card)]/50 border-[var(--border)]">
            <CardContent className="p-12 text-center">
              <Bot className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
              <p className="text-[var(--muted-foreground)]">No collectors created yet</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">Click "Make a COLLECTOR" to create your first bot</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bot Detail Modal */}
      <Dialog open={!!selectedBot} onOpenChange={() => setSelectedBot(null)}>
        <DialogContent className="sm:max-w-2xl bg-[var(--card)] border-[var(--border)]">
          {selectedBot && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--gold)] to-amber-500 rounded flex items-center justify-center">
                    {selectedBot.profilePicture}
                  </div>
                  {selectedBot.username}
                </DialogTitle>
                <DialogDescription>
                  Detailed statistics and configuration for this collector bot
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[var(--background)]/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-[var(--muted-foreground)]">Win Probability</p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">{selectedBot.winProbability}%</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[var(--background)]/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-[var(--muted-foreground)]">Game Interval</p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">{selectedBot.gameInterval}m</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="font-semibold text-[var(--foreground)] mb-3">Allowed Games</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBot.allowedGames.map((game) => (
                      <Badge key={game} variant="secondary">
                        {game.replace("-", " ").toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedBot.canBuyShopItems && (
                  <div>
                    <h4 className="font-semibold text-[var(--foreground)] mb-3">Shop Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBot.allowedShopItems.map((item) => (
                        <Badge key={item} variant="outline">
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-[var(--muted)]/20 rounded-lg">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium">Created:</span> {new Date(selectedBot.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    <span className="font-medium">Created by:</span> {selectedBot.createdBy.slice(0, 8)}...{selectedBot.createdBy.slice(-8)}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}