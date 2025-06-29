import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Settings, Upload, Eye, EyeOff, Volume2, VolumeX, Palette, Shield, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UserSettings {
  // Sound settings
  masterSound: boolean;
  soundPack: string;
  ambientAudio: boolean;
  
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

const defaultSettings: UserSettings = {
  masterSound: true,
  soundPack: "night_ambience",
  ambientAudio: true,
  hudTheme: "midnight",
  profileBorder: "default",
  backgroundTheme: "night_city",
  animatedCursor: true,
  backgroundParticles: true,
  textSize: "medium",
  chatVisibility: true,
  ghostMode: false,
  blockMentions: false,
  chatToastNotifications: true,
  wagerWarnings: true,
  liveToasts: true
};

export function SettingsPanel() {
  const { user, disconnect } = useWallet();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [showWinningsSummary, setShowWinningsSummary] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load user settings on mount
  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const savedSettings = localStorage.getItem(`settings_${user?.id}`);
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      // Save to localStorage for now
      localStorage.setItem(`settings_${user?.id}`, JSON.stringify(updatedSettings));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Convert to base64 for now
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        // Here you would normally upload to your backend
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been changed.",
          className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:text-[var(--gold)] hover:bg-white/10 transition-all duration-200"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[var(--gold)] flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Settings Panel
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="sound" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/30">
            <TabsTrigger value="sound" className="data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black">
              <Volume2 className="w-4 h-4 mr-1" />
              Sound
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black">
              <Palette className="w-4 h-4 mr-1" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-1" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="gameplay" className="data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black">
              <User className="w-4 h-4 mr-1" />
              Gameplay
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black">
              <LogOut className="w-4 h-4 mr-1" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Sound Settings */}
          <TabsContent value="sound" className="space-y-4">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-[var(--gold)]">Sound Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="master-sound">Master Sound</Label>
                  <Switch
                    id="master-sound"
                    checked={settings.masterSound}
                    onCheckedChange={(checked) => saveSettings({ masterSound: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Sound Pack</Label>
                  <Select value={settings.soundPack} onValueChange={(value) => saveSettings({ soundPack: value })}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="night_ambience">Night Ambience</SelectItem>
                      <SelectItem value="city_whispers">City Whispers</SelectItem>
                      <SelectItem value="dream_synth">Dream Synth</SelectItem>
                      <SelectItem value="rain_walker">Rain Walker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="ambient-audio">Ambient Background Audio</Label>
                  <Switch
                    id="ambient-audio"
                    checked={settings.ambientAudio}
                    onCheckedChange={(checked) => saveSettings({ ambientAudio: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visual Settings */}
          <TabsContent value="visual" className="space-y-4">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-[var(--gold)]">Interface & Visuals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>HUD Theme</Label>
                  <Select value={settings.hudTheme} onValueChange={(value) => saveSettings({ hudTheme: value })}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midnight">Midnight</SelectItem>
                      <SelectItem value="neon">Neon Glow</SelectItem>
                      <SelectItem value="minimal">Minimal Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Profile Border</Label>
                  <Select value={settings.profileBorder} onValueChange={(value) => saveSettings({ profileBorder: value })}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="neon_pulse">Neon Pulse</SelectItem>
                      <SelectItem value="lunar_fade">Lunar Fade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Text Size</Label>
                  <Select value={settings.textSize} onValueChange={(value) => saveSettings({ textSize: value as any })}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="animated-cursor">Animated Cursor</Label>
                  <Switch
                    id="animated-cursor"
                    checked={settings.animatedCursor}
                    onCheckedChange={(checked) => saveSettings({ animatedCursor: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="background-particles">Background Particles</Label>
                  <Switch
                    id="background-particles"
                    checked={settings.backgroundParticles}
                    onCheckedChange={(checked) => saveSettings({ backgroundParticles: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-[var(--gold)]">Privacy & Chat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chat-visibility">Chat Visibility</Label>
                  <Switch
                    id="chat-visibility"
                    checked={settings.chatVisibility}
                    onCheckedChange={(checked) => saveSettings({ chatVisibility: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ghost-mode">Ghost Mode</Label>
                    <Switch
                      id="ghost-mode"
                      checked={settings.ghostMode}
                      onCheckedChange={(checked) => saveSettings({ ghostMode: checked })}
                    />
                  </div>
                  {settings.ghostMode && (
                    <div className="flex items-start gap-2 p-3 bg-orange-500/20 border border-orange-500/40 rounded-md">
                      <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-orange-200">
                        When Ghost Mode is active, you will not be eligible for streak-based rewards, badges, 
                        leaderboard streak tracking, or any achievements that rely on public visibility.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="block-mentions">Block Mentions</Label>
                  <Switch
                    id="block-mentions"
                    checked={settings.blockMentions}
                    onCheckedChange={(checked) => saveSettings({ blockMentions: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="chat-toast">Chat Toast Notifications</Label>
                  <Switch
                    id="chat-toast"
                    checked={settings.chatToastNotifications}
                    onCheckedChange={(checked) => saveSettings({ chatToastNotifications: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gameplay Settings */}
          <TabsContent value="gameplay" className="space-y-4">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-[var(--gold)]">Gameplay Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="wager-warnings">Wager Warnings</Label>
                    <p className="text-sm text-gray-400">Show warning when betting more than 0.5 SOL</p>
                  </div>
                  <Switch
                    id="wager-warnings"
                    checked={settings.wagerWarnings}
                    onCheckedChange={(checked) => saveSettings({ wagerWarnings: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="live-toasts">Live Toasts (Win/Loss Alerts)</Label>
                  <Switch
                    id="live-toasts"
                    checked={settings.liveToasts}
                    onCheckedChange={(checked) => saveSettings({ liveToasts: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Management */}
          <TabsContent value="account" className="space-y-4">
            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-[var(--gold)]">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar-upload">Upload New Profile Picture</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploading}
                      className="bg-black/40"
                    />
                    <Upload className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowWinningsSummary(true)}
                  className="w-full border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black"
                >
                  View Winnings Summary
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black">
                    <a href="/terms" target="_blank">Terms of Service</a>
                  </Button>
                  <Button variant="outline" asChild className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black">
                    <a href="/privacy" target="_blank">Privacy Policy</a>
                  </Button>
                </div>
                
                <Button
                  variant="destructive"
                  onClick={disconnect}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* Winnings Summary Modal */}
      <Dialog open={showWinningsSummary} onOpenChange={setShowWinningsSummary}>
        <DialogContent className="bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
          <DialogHeader>
            <DialogTitle className="text-[var(--gold)]">Winnings Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/40">
                <div className="text-2xl font-bold text-green-400">{user.totalWon || "0"} SOL</div>
                <div className="text-sm text-gray-400">Total Won</div>
              </div>
              <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/40">
                <div className="text-2xl font-bold text-blue-400">{user.totalWagered || "0"} SOL</div>
                <div className="text-sm text-gray-400">Total Wagered</div>
              </div>
            </div>
            <div className="text-center p-4 bg-[var(--gold)]/20 rounded-lg border border-[var(--gold)]/40">
              <div className="text-2xl font-bold text-[var(--gold)]">{user.maxStreak || 0}</div>
              <div className="text-sm text-gray-400">Best Streak</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}