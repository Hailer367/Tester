import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Upload, 
  LogOut, 
  FileText, 
  Shield,
  Palette,
  MessageCircle,
  Gamepad2,
  User,
  X,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SettingsData {
  // Sound Settings
  masterSound: boolean;
  activeSoundPack: string;
  ambientLoop: boolean;
  
  // Interface & Visuals
  hudTheme: string;
  profileBorder: string;
  backgroundTheme: string;
  animatedCursor: boolean;
  backgroundParticles: boolean;
  textSize: "small" | "medium" | "large";
  
  // Privacy & Chat
  chatVisibility: boolean;
  ghostMode: boolean;
  blockMentions: boolean;
  chatToastNotifications: boolean;
  
  // Gameplay Preferences
  wagerWarnings: boolean;
  liveToasts: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsData;
  onSettingsChange: (settings: Partial<SettingsData>) => void;
}

export function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showWinningSummary, setShowWinningSummary] = useState(false);

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    onSettingsChange({ [key]: value });
    toast({
      title: "Setting Updated",
      description: "Your preferences have been saved automatically.",
      duration: 2000,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would handle the avatar upload
      toast({
        title: "Avatar Uploaded",
        description: "Your new profile picture has been set.",
      });
    }
  };

  const handleDisconnectWallet = () => {
    // Handle wallet disconnection
    toast({
      title: "Wallet Disconnected",
      description: "You have been safely disconnected from your wallet.",
      variant: "destructive",
    });
  };

  const soundPacks = [
    { value: "city-whispers", label: "City Whispers", rarity: "common" },
    { value: "dream-synth", label: "Dream Synth", rarity: "common", price: "0.005 SOL" },
    { value: "rain-walker", label: "Rain Walker", rarity: "common" },
    { value: "starlight-drift", label: "Starlight Drift", rarity: "rare", price: "0.007 SOL" },
    { value: "misty-alley", label: "Misty Alley", rarity: "rare" },
  ];

  const hudThemes = [
    { value: "midnight", label: "Midnight Glow" },
    { value: "neon", label: "Neon Dreams" },
    { value: "aurora", label: "Aurora Nights" },
  ];

  const profileBorders = [
    { value: "neon-pulse", label: "Neon Pulse", rarity: "common" },
    { value: "lunar-fade", label: "Lunar Fade", rarity: "common" },
    { value: "sapphire-crown", label: "Sapphire Crown", rarity: "rare", price: "0.01 SOL" },
    { value: "void-circuit", label: "Void Circuit", rarity: "epic", price: "0.02 SOL" },
  ];

  const backgroundThemes = [
    { value: "cityscape", label: "Night Cityscape" },
    { value: "starfield", label: "Cosmic Void" },
    { value: "rain", label: "Rainy Streets" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-[var(--card)] to-[var(--background)] border-l border-[var(--border)] z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--card)]/95 backdrop-blur-sm border-b border-[var(--border)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] rounded-lg">
                    <Settings className="w-4 h-4 text-[var(--primary-foreground)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <Tabs defaultValue="sound" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--muted)]/50">
                  <TabsTrigger value="sound" className="text-xs">
                    <Volume2 className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="interface" className="text-xs">
                    <Palette className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="text-xs">
                    <MessageCircle className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="gameplay" className="text-xs">
                    <Gamepad2 className="w-3 h-3" />
                  </TabsTrigger>
                  <TabsTrigger value="account" className="text-xs">
                    <User className="w-3 h-3" />
                  </TabsTrigger>
                </TabsList>

                {/* Sound Settings */}
                <TabsContent value="sound" className="space-y-4 mt-4">
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Sound Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="master-sound" className="text-sm">Master Sound</Label>
                        <Switch
                          id="master-sound"
                          checked={settings.masterSound}
                          onCheckedChange={(checked) => handleSettingChange("masterSound", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Active Sound Pack</Label>
                        <Select
                          value={settings.activeSoundPack}
                          onValueChange={(value) => handleSettingChange("activeSoundPack", value)}
                        >
                          <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {soundPacks.map((pack) => (
                              <SelectItem key={pack.value} value={pack.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{pack.label}</span>
                                  {pack.price && (
                                    <span className="text-xs text-[var(--primary)] ml-2">{pack.price}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="ambient-loop" className="text-sm">Ambient Background Audio</Label>
                        <Switch
                          id="ambient-loop"
                          checked={settings.ambientLoop}
                          onCheckedChange={(checked) => handleSettingChange("ambientLoop", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Interface & Visuals */}
                <TabsContent value="interface" className="space-y-4 mt-4">
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Interface & Visuals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">HUD Theme</Label>
                        <Select
                          value={settings.hudTheme}
                          onValueChange={(value) => handleSettingChange("hudTheme", value)}
                        >
                          <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hudThemes.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                {theme.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Profile Border</Label>
                        <Select
                          value={settings.profileBorder}
                          onValueChange={(value) => handleSettingChange("profileBorder", value)}
                        >
                          <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {profileBorders.map((border) => (
                              <SelectItem key={border.value} value={border.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{border.label}</span>
                                  {border.price && (
                                    <span className="text-xs text-[var(--primary)] ml-2">{border.price}</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Background Theme</Label>
                        <Select
                          value={settings.backgroundTheme}
                          onValueChange={(value) => handleSettingChange("backgroundTheme", value)}
                        >
                          <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {backgroundThemes.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                {theme.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="animated-cursor" className="text-sm">Animated Cursor</Label>
                        <Switch
                          id="animated-cursor"
                          checked={settings.animatedCursor}
                          onCheckedChange={(checked) => handleSettingChange("animatedCursor", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="background-particles" className="text-sm">Background Particles</Label>
                        <Switch
                          id="background-particles"
                          checked={settings.backgroundParticles}
                          onCheckedChange={(checked) => handleSettingChange("backgroundParticles", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Text Size</Label>
                        <Select
                          value={settings.textSize}
                          onValueChange={(value) => handleSettingChange("textSize", value as "small" | "medium" | "large")}
                        >
                          <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy & Chat */}
                <TabsContent value="privacy" className="space-y-4 mt-4">
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Privacy & Chat
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chat-visibility" className="text-sm">Chat Visibility</Label>
                        <Switch
                          id="chat-visibility"
                          checked={settings.chatVisibility}
                          onCheckedChange={(checked) => handleSettingChange("chatVisibility", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ghost-mode" className="text-sm">Ghost Mode</Label>
                          <Switch
                            id="ghost-mode"
                            checked={settings.ghostMode}
                            onCheckedChange={(checked) => handleSettingChange("ghostMode", checked)}
                          />
                        </div>
                        {settings.ghostMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                          >
                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-200">
                              Ghost Mode disables streak rewards, badges, leaderboard tracking, and achievements that rely on public visibility.
                            </p>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="block-mentions" className="text-sm">Block Mentions</Label>
                        <Switch
                          id="block-mentions"
                          checked={settings.blockMentions}
                          onCheckedChange={(checked) => handleSettingChange("blockMentions", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="chat-notifications" className="text-sm">Chat Toast Notifications</Label>
                        <Switch
                          id="chat-notifications"
                          checked={settings.chatToastNotifications}
                          onCheckedChange={(checked) => handleSettingChange("chatToastNotifications", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Gameplay Preferences */}
                <TabsContent value="gameplay" className="space-y-4 mt-4">
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4" />
                        Gameplay Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="wager-warnings" className="text-sm">Wager Warnings</Label>
                          <p className="text-xs text-[var(--muted-foreground)]">Alert when betting over 0.5 SOL</p>
                        </div>
                        <Switch
                          id="wager-warnings"
                          checked={settings.wagerWarnings}
                          onCheckedChange={(checked) => handleSettingChange("wagerWarnings", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="live-toasts" className="text-sm">Live Toasts</Label>
                          <p className="text-xs text-[var(--muted-foreground)]">Show win/loss alerts</p>
                        </div>
                        <Switch
                          id="live-toasts"
                          checked={settings.liveToasts}
                          onCheckedChange={(checked) => handleSettingChange("liveToasts", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Management */}
                <TabsContent value="account" className="space-y-4 mt-4">
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Profile Picture</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full justify-start"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New Avatar
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowWinningSummary(true)}
                        className="w-full justify-start"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Winnings Summary
                      </Button>

                      <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full justify-start"
                        >
                          <a href="/terms">
                            <FileText className="w-4 h-4 mr-2" />
                            Terms of Service
                          </a>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full justify-start"
                        >
                          <a href="/privacy">
                            <Shield className="w-4 h-4 mr-2" />
                            Privacy Policy
                          </a>
                        </Button>
                      </div>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDisconnectWallet}
                        className="w-full justify-start mt-4"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Disconnect Wallet
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>

          {/* Winnings Summary Modal */}
          <Dialog open={showWinningSummary} onOpenChange={setShowWinningSummary}>
            <DialogContent className="sm:max-w-md bg-[var(--card)] border-[var(--border)]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                  Winnings Summary
                </DialogTitle>
                <DialogDescription>
                  Your gambling performance overview
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--muted)]/50 rounded-lg">
                    <p className="text-sm text-[var(--muted-foreground)]">Total Wagered</p>
                    <p className="text-lg font-semibold text-[var(--foreground)]">2.45 SOL</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-300">Total Won</p>
                    <p className="text-lg font-semibold text-green-400">3.12 SOL</p>
                  </div>
                </div>
                <div className="p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
                  <p className="text-sm text-[var(--primary)]">Net Profit</p>
                  <p className="text-xl font-bold text-[var(--primary)]">+0.67 SOL</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}

export const defaultSettings: SettingsData = {
  masterSound: true,
  activeSoundPack: "city-whispers",
  ambientLoop: true,
  hudTheme: "midnight",
  profileBorder: "neon-pulse",
  backgroundTheme: "cityscape",
  animatedCursor: true,
  backgroundParticles: true,
  textSize: "medium",
  chatVisibility: true,
  ghostMode: false,
  blockMentions: false,
  chatToastNotifications: true,
  wagerWarnings: true,
  liveToasts: true,
};