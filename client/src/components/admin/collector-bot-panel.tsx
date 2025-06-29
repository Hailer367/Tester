import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Crown,
  Eye,
  EyeOff,
  Coins,
  Clock,
  Gamepad2,
  ShoppingBag,
  Wallet,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isAuthorizedAdmin } from "@/lib/admin-utils";

interface CollectorBot {
  id: number;
  username: string;
  profilePicture: string;
  walletPrivateKey: string;
  allowedGames: string[];
  winProbability: string;
  gameInterval: number;
  canPlayMultiple: boolean;
  minStakeSOL: string;
  maxStakeSOL: string;
  canBuyShopItems: boolean;
  allowedShopItems: string[];
  ghostMode: boolean;
  botType: "COLLECTOR" | "MILE_COLLECTOR";
  isActive: boolean;
  schedule?: string;
  createdAt: string;
}

const gameTypes = [
  "Moon Flip",
  "Dice Duel", 
  "Snake & Ladder",
  "Wheel of Fate",
  "Mine Flip",
  "Mystery Box",
  "Roulette Lite"
];

const shopItemCategories = [
  "Profile Borders",
  "Sound Packs", 
  "Avatar Effects",
  "Coin Skins",
  "Background Themes"
];

export function CollectorBotPanel() {
  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [selectedBot, setSelectedBot] = useState<CollectorBot | null>(null);

  // Form state for creating/editing bots
  const [formData, setFormData] = useState({
    username: "",
    profilePicture: "",
    walletPrivateKey: "",
    allowedGames: [] as string[],
    winProbability: "50",
    gameInterval: 5,
    canPlayMultiple: false,
    minStakeSOL: "0.001",
    maxStakeSOL: "0.1",
    canBuyShopItems: false,
    allowedShopItems: [] as string[],
    ghostMode: false,
    botType: "COLLECTOR" as "COLLECTOR" | "MILE_COLLECTOR",
    schedule: ""
  });

  // Check admin access
  const isAdmin = user ? isAuthorizedAdmin(user.walletAddress) : false;

  // Fetch collector bots
  const { data: collectorBots = [], isLoading } = useQuery<CollectorBot[]>({
    queryKey: ["/api/admin/collector-bots"],
    enabled: Boolean(isOpen && isAdmin)
  });

  // Create bot mutation
  const createBotMutation = useMutation({
    mutationFn: async (botData: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/collector-bots", botData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/collector-bots"] });
      setShowCreateBot(false);
      resetForm();
      toast({
        title: "Collector Created",
        description: "New collector bot has been created successfully.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create collector bot.",
        variant: "destructive"
      });
    }
  });

  // Toggle bot status mutation
  const toggleBotMutation = useMutation({
    mutationFn: async ({ botId, isActive }: { botId: number; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/collector-bots/${botId}/toggle`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/collector-bots"] });
      toast({
        title: "Bot Status Updated",
        description: "Collector bot status has been changed.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    }
  });

  // Delete bot mutation
  const deleteBotMutation = useMutation({
    mutationFn: async (botId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/collector-bots/${botId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/collector-bots"] });
      toast({
        title: "Bot Deleted",
        description: "Collector bot has been removed.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      username: "",
      profilePicture: "",
      walletPrivateKey: "",
      allowedGames: [],
      winProbability: "50",
      gameInterval: 5,
      canPlayMultiple: false,
      minStakeSOL: "0.001",
      maxStakeSOL: "0.1",
      canBuyShopItems: false,
      allowedShopItems: [],
      ghostMode: false,
      botType: "COLLECTOR",
      schedule: ""
    });
  };

  const handleCreateBot = () => {
    if (!formData.username || !formData.walletPrivateKey || formData.allowedGames.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createBotMutation.mutate(formData);
  };

  const handleGameToggle = (game: string) => {
    setFormData(prev => ({
      ...prev,
      allowedGames: prev.allowedGames.includes(game)
        ? prev.allowedGames.filter(g => g !== game)
        : [...prev.allowedGames, game]
    }));
  };

  const handleShopItemToggle = (item: string) => {
    setFormData(prev => ({
      ...prev,
      allowedShopItems: prev.allowedShopItems.includes(item)
        ? prev.allowedShopItems.filter(i => i !== item)
        : [...prev.allowedShopItems, item]
    }));
  };

  const renderBotCard = (bot: CollectorBot) => (
    <Card key={bot.id} className="bg-black/40 border-white/20 hover:border-[var(--gold)]/50 transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[var(--gold)] to-yellow-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-black" />
              </div>
              {bot.botType === "MILE_COLLECTOR" && (
                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-[var(--gold)]" />
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black">
                <div className={`w-full h-full rounded-full ${bot.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                {bot.username}
                {bot.ghostMode && <EyeOff className="w-4 h-4 text-gray-400" />}
              </CardTitle>
              <p className="text-sm text-gray-400">{bot.botType}</p>
            </div>
          </div>
          <Badge variant={bot.isActive ? "default" : "secondary"}>
            {bot.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Win Rate:</p>
            <p className="text-white">{bot.winProbability}%</p>
          </div>
          <div>
            <p className="text-gray-400">Interval:</p>
            <p className="text-white">{bot.gameInterval}min</p>
          </div>
          <div>
            <p className="text-gray-400">Stake Range:</p>
            <p className="text-white">{bot.minStakeSOL} - {bot.maxStakeSOL} SOL</p>
          </div>
          <div>
            <p className="text-gray-400">Games:</p>
            <p className="text-white">{bot.allowedGames.length}</p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant={bot.isActive ? "destructive" : "default"}
            onClick={() => toggleBotMutation.mutate({ botId: bot.id, isActive: !bot.isActive })}
            disabled={toggleBotMutation.isPending}
          >
            {bot.isActive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {bot.isActive ? "Pause" : "Start"}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedBot(bot)}
          >
            <Settings className="w-3 h-3 mr-1" />
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm(`Delete collector ${bot.username}?`)) {
                deleteBotMutation.mutate(bot.id);
              }
            }}
            disabled={deleteBotMutation.isPending}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!isAdmin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:text-[var(--gold)] hover:bg-white/10 transition-all duration-200"
        >
          <Bot className="w-4 h-4 mr-2" />
          Collectors
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[var(--gold)] flex items-center gap-2">
            <Bot className="w-8 h-8" />
            Collector Management Panel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {(collectorBots as CollectorBot[]).length} collector bots • {(collectorBots as CollectorBot[]).filter((b: CollectorBot) => b.isActive).length} active
            </div>
            <Button
              onClick={() => setShowCreateBot(true)}
              className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Make a COLLECTOR
            </Button>
          </div>

          {/* Bots Grid */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading collector bots...</p>
            </div>
          ) : (collectorBots as CollectorBot[]).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(collectorBots as CollectorBot[]).map(renderBotCard)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No collector bots created yet.</p>
              <p className="text-sm mt-2">Create your first collector to automate gameplay.</p>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Create Bot Dialog */}
      <Dialog open={showCreateBot} onOpenChange={setShowCreateBot}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[var(--gold)]">Create New Collector</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Bot Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter bot username"
                    className="bg-black/40"
                  />
                </div>
                
                <div>
                  <Label htmlFor="botType">Bot Type</Label>
                  <Select value={formData.botType} onValueChange={(value: any) => setFormData(prev => ({ ...prev, botType: value }))}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLLECTOR">COLLECTOR</SelectItem>
                      <SelectItem value="MILE_COLLECTOR">MILE COLLECTOR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                  id="profilePicture"
                  value={formData.profilePicture}
                  onChange={(e) => setFormData(prev => ({ ...prev, profilePicture: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-black/40"
                />
              </div>
              
              <div>
                <Label htmlFor="walletPrivateKey">Wallet Private Key *</Label>
                <Input
                  id="walletPrivateKey"
                  type="password"
                  value={formData.walletPrivateKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, walletPrivateKey: e.target.value }))}
                  placeholder="Enter wallet private key"
                  className="bg-black/40"
                />
                <p className="text-xs text-gray-400 mt-1">This will be encrypted and stored securely</p>
              </div>
            </div>

            {/* Game Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Game Configuration</h3>
              
              <div>
                <Label>Allowed Games *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {gameTypes.map(game => (
                    <label key={game} className="flex items-center gap-2 p-2 bg-black/20 rounded cursor-pointer hover:bg-black/40">
                      <input
                        type="checkbox"
                        checked={formData.allowedGames.includes(game)}
                        onChange={() => handleGameToggle(game)}
                        className="rounded"
                      />
                      <span className="text-sm">{game}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="winProbability">Win Probability (%)</Label>
                  <Input
                    id="winProbability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.winProbability}
                    onChange={(e) => setFormData(prev => ({ ...prev, winProbability: e.target.value }))}
                    className="bg-black/40"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gameInterval">Game Interval (minutes)</Label>
                  <Input
                    id="gameInterval"
                    type="number"
                    min="1"
                    value={formData.gameInterval}
                    onChange={(e) => setFormData(prev => ({ ...prev, gameInterval: parseInt(e.target.value) }))}
                    className="bg-black/40"
                  />
                </div>
                
                <div className="flex items-center justify-center pt-6">
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={formData.canPlayMultiple}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canPlayMultiple: checked }))}
                    />
                    <span className="text-sm">Multiple Games</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minStakeSOL">Min Stake (SOL)</Label>
                  <Input
                    id="minStakeSOL"
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.minStakeSOL}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStakeSOL: e.target.value }))}
                    className="bg-black/40"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxStakeSOL">Max Stake (SOL)</Label>
                  <Input
                    id="maxStakeSOL"
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.maxStakeSOL}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxStakeSOL: e.target.value }))}
                    className="bg-black/40"
                  />
                </div>
              </div>
            </div>

            {/* Shop Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Shop & Behavior</h3>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={formData.canBuyShopItems}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, canBuyShopItems: checked }))}
                  />
                  <span>Can Buy Shop Items</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <Switch
                    checked={formData.ghostMode}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ghostMode: checked }))}
                  />
                  <span>Ghost Mode</span>
                </label>
              </div>
              
              {formData.canBuyShopItems && (
                <div>
                  <Label>Allowed Shop Categories</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {shopItemCategories.map(category => (
                      <label key={category} className="flex items-center gap-2 p-2 bg-black/20 rounded cursor-pointer hover:bg-black/40">
                        <input
                          type="checkbox"
                          checked={formData.allowedShopItems.includes(category)}
                          onChange={() => handleShopItemToggle(category)}
                          className="rounded"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.botType === "MILE_COLLECTOR" && (
                <div>
                  <Label htmlFor="schedule">Active Schedule (Optional)</Label>
                  <Textarea
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                    placeholder="e.g., Monday-Friday 9AM-5PM PST"
                    className="bg-black/40"
                  />
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-200">
                  <p className="font-semibold mb-1">Important Security Notice:</p>
                  <p>The wallet private key will be encrypted and stored securely. Ensure the wallet has sufficient SOL for gameplay and fees. The bot will operate according to your settings and cannot be held responsible for losses.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateBot(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateBot}
                disabled={createBotMutation.isPending}
                className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80"
              >
                {createBotMutation.isPending ? "Creating..." : "Done"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}