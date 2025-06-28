import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, AlertTriangle, Gamepad2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GameStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  isLocked: boolean;
  lockReason?: string;
  lockedBy?: string;
  lockedAt?: string;
  playerCount: number;
  activeGames: number;
}

interface GameLockControlProps {
  adminWallet: string;
}

const gameStatuses: GameStatus[] = [
  {
    id: "moon-flip",
    name: "Moon Flip",
    description: "Classic coin flip game with lunar theme",
    icon: Gamepad2,
    isLocked: false,
    playerCount: 12,
    activeGames: 3
  },
  {
    id: "snake-ladder",
    name: "Snake & Ladder",
    description: "Race to position 100 in this board game",
    icon: Gamepad2,
    isLocked: true,
    lockReason: "Server maintenance in progress. We're updating the game engine for better performance and fairness.",
    lockedBy: "GH7dc4Wihg79nWFCCJH4NUcE368zXkWhgsDTEbWup7Eb",
    lockedAt: "2025-06-28T15:30:00Z",
    playerCount: 0,
    activeGames: 0
  },
  {
    id: "dice-duel",
    name: "Dice Duel",
    description: "Coming soon - Roll dice against opponents",
    icon: Gamepad2,
    isLocked: true,
    lockReason: "Game is currently in development. Expected release: July 2025",
    lockedBy: "System",
    lockedAt: "2025-06-01T00:00:00Z",
    playerCount: 0,
    activeGames: 0
  }
];

export function GameLockControl({ adminWallet }: GameLockControlProps) {
  const [games, setGames] = useState<GameStatus[]>(gameStatuses);
  const [selectedGame, setSelectedGame] = useState<GameStatus | null>(null);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState("");
  const { toast } = useToast();

  const handleToggleLock = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    if (game.isLocked) {
      // Unlock game
      setGames(games.map(g => 
        g.id === gameId 
          ? { ...g, isLocked: false, lockReason: undefined, lockedBy: undefined, lockedAt: undefined }
          : g
      ));
      toast({
        title: "Game Unlocked",
        description: `${game.name} is now available for players`,
      });
    } else {
      // Show lock modal
      setSelectedGame(game);
      setLockReason("");
      setIsLockModalOpen(true);
    }
  };

  const confirmLock = () => {
    if (!selectedGame || !lockReason.trim()) return;

    setGames(games.map(g => 
      g.id === selectedGame.id 
        ? { 
            ...g, 
            isLocked: true, 
            lockReason: lockReason.trim(),
            lockedBy: adminWallet,
            lockedAt: new Date().toISOString()
          }
        : g
    ));

    setIsLockModalOpen(false);
    setSelectedGame(null);
    setLockReason("");

    toast({
      title: "Game Locked",
      description: `${selectedGame.name} has been locked for players`,
      variant: "destructive"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const formatWalletAddress = (address: string) => {
    if (address === "System") return "System";
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Game Lock Control</h2>
          <p className="text-[var(--muted-foreground)]">Manage game availability and provide maintenance notices</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Unlock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Available Games</p>
                <p className="text-2xl font-bold text-green-400">
                  {games.filter(g => !g.isLocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Locked Games</p>
                <p className="text-2xl font-bold text-red-400">
                  {games.filter(g => g.isLocked).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--card)]/50 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-[var(--primary)]" />
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Active Games</p>
                <p className="text-2xl font-bold text-[var(--primary)]">
                  {games.reduce((sum, game) => sum + game.activeGames, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 bg-[var(--card)]/50 border rounded-lg transition-all duration-300",
                game.isLocked ? "border-red-500/30 bg-red-500/5" : "border-green-500/30 bg-green-500/5"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-lg",
                    game.isLocked 
                      ? "bg-red-500/20 border border-red-500/30" 
                      : "bg-green-500/20 border border-green-500/30"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6",
                      game.isLocked ? "text-red-400" : "text-green-400"
                    )} />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">{game.name}</h3>
                      <Badge variant={game.isLocked ? "destructive" : "secondary"} className="text-xs">
                        {game.isLocked ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
                            Available
                          </>
                        )}
                      </Badge>
                    </div>

                    <p className="text-sm text-[var(--muted-foreground)]">{game.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[var(--muted-foreground)]">Players Online</p>
                        <p className="font-medium text-[var(--foreground)]">{game.playerCount}</p>
                      </div>
                      <div>
                        <p className="text-[var(--muted-foreground)]">Active Games</p>
                        <p className="font-medium text-[var(--foreground)]">{game.activeGames}</p>
                      </div>
                    </div>

                    {game.isLocked && game.lockReason && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-amber-200">Reason for Lock:</p>
                            <p className="text-sm text-amber-300">{game.lockReason}</p>
                            {game.lockedBy && game.lockedAt && (
                              <p className="text-xs text-amber-400">
                                Locked by {formatWalletAddress(game.lockedBy)} on {formatDate(game.lockedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`game-${game.id}`}
                      checked={!game.isLocked}
                      onCheckedChange={() => handleToggleLock(game.id)}
                    />
                    <Label htmlFor={`game-${game.id}`} className="text-sm">
                      {game.isLocked ? "Locked" : "Available"}
                    </Label>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lock Reason Modal */}
      <Dialog open={isLockModalOpen} onOpenChange={setIsLockModalOpen}>
        <DialogContent className="sm:max-w-md bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              Lock Game: {selectedGame?.name}
            </DialogTitle>
            <DialogDescription>
              Provide a reason for locking this game. This will be displayed to players.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="lock-reason" className="text-sm font-medium">
                Lock Reason (Public Message)
              </Label>
              <Textarea
                id="lock-reason"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="e.g., Maintenance in progress, Server updates, Temporary technical issues..."
                className="bg-[var(--background)] border-[var(--border)] mt-2"
                rows={4}
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-200">Player Notification</p>
                  <p className="text-sm text-amber-300">
                    Players will see this message when trying to access the game. Be clear and informative.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsLockModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmLock}
              disabled={!lockReason.trim()}
              variant="destructive"
            >
              <Lock className="w-4 h-4 mr-2" />
              Lock Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}