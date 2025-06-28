import { useState } from "react";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { AdminSetting } from "@shared/schema";

export function CasinoSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery<AdminSetting[]>({
    queryKey: ["/api/admin/settings"],
    refetchInterval: 30000
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: Record<string, string>) => {
      const response = await apiRequest("PATCH", "/api/admin/settings", settingsData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setHasChanges(false);
    }
  });

  // Convert settings array to object for easier access
  const settingsObj = settings.reduce((acc, setting) => {
    acc[setting.settingKey] = setting.settingValue;
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState<Record<string, string>>({});

  // Update form data when settings load
  React.useEffect(() => {
    if (settings.length > 0) {
      setFormData(settingsObj);
    }
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(formData);
  };

  const handleResetSettings = () => {
    setFormData(settingsObj);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Casino Settings</h2>
          <p className="text-gray-400">Configure global casino parameters and features</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Button
              onClick={handleResetSettings}
              variant="ghost"
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-undo mr-2"></i>
              Reset Changes
            </Button>
          )}
          
          <Button
            onClick={handleSaveSettings}
            disabled={updateSettingsMutation.isPending || !hasChanges}
            className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] hover:shadow-lg hover:shadow-[var(--gold)]/50"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-morphism rounded-xl p-12 text-center">
          <i className="fas fa-spinner fa-spin text-[var(--gold)] text-3xl mb-4"></i>
          <p className="text-gray-400">Loading casino settings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-cogs text-[var(--gold)] mr-3"></i>
              General Settings
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Temporarily disable user access</p>
                </div>
                <Switch
                  checked={formData.maintenanceMode === "true"}
                  onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked.toString())}
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Maximum Players Online</Label>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.maxPlayersOnline || ""}
                  onChange={(e) => handleInputChange("maxPlayersOnline", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Default House Edge (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.defaultHouseEdge || ""}
                  onChange={(e) => handleInputChange("defaultHouseEdge", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Enable Devnet Mode</Label>
                  <p className="text-sm text-gray-400">Use Solana devnet for testing</p>
                </div>
                <Switch
                  checked={formData.enableDevnet === "true"}
                  onCheckedChange={(checked) => handleInputChange("enableDevnet", checked.toString())}
                />
              </div>
            </div>
          </div>

          {/* Game Configuration */}
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-gamepad text-[var(--gold)] mr-3"></i>
              Game Configuration
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-white font-medium mb-2 block">Minimum Bet Amount (SOL)</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.minBetAmount || ""}
                  onChange={(e) => handleInputChange("minBetAmount", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Maximum Bet Amount (SOL)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.maxBetAmount || ""}
                  onChange={(e) => handleInputChange("maxBetAmount", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Default Playing Fee (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.defaultPlayingFee || ""}
                  onChange={(e) => handleInputChange("defaultPlayingFee", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">Fee charged only on winning bets</p>
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Game Selection Strategy</Label>
                <Select
                  value={formData.gameSelectionStrategy || "random"}
                  onValueChange={(value) => handleInputChange("gameSelectionStrategy", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Random Selection</SelectItem>
                    <SelectItem value="weighted">Weighted by Popularity</SelectItem>
                    <SelectItem value="sequential">Sequential Rotation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* UI & UX Settings */}
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-palette text-[var(--gold)] mr-3"></i>
              UI & UX Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-white font-medium mb-2 block">Banner Message</Label>
                <Textarea
                  placeholder="Enter announcement or promotional message..."
                  value={formData.bannerMessage || ""}
                  onChange={(e) => handleInputChange("bannerMessage", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Theme Mode</Label>
                <Select
                  value={formData.themeMode || "dark"}
                  onValueChange={(value) => handleInputChange("themeMode", value)}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark (Call of the Night)</SelectItem>
                    <SelectItem value="auto">Auto (System Preference)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Enable Sound Effects</Label>
                  <p className="text-sm text-gray-400">Global sound toggle</p>
                </div>
                <Switch
                  checked={formData.enableSounds === "true"}
                  onCheckedChange={(checked) => handleInputChange("enableSounds", checked.toString())}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Show Animations</Label>
                  <p className="text-sm text-gray-400">Enable UI animations</p>
                </div>
                <Switch
                  checked={formData.showAnimations === "true"}
                  onCheckedChange={(checked) => handleInputChange("showAnimations", checked.toString())}
                />
              </div>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="glass-morphism rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-shield-alt text-[var(--gold)] mr-3"></i>
              Security & Compliance
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-white font-medium mb-2 block">Rate Limit (requests/minute)</Label>
                <Input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.rateLimit || ""}
                  onChange={(e) => handleInputChange("rateLimit", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div>
                <Label className="text-white font-medium mb-2 block">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.sessionTimeout || ""}
                  onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Enable IP Blocking</Label>
                  <p className="text-sm text-gray-400">Block suspicious IP addresses</p>
                </div>
                <Switch
                  checked={formData.enableIpBlocking === "true"}
                  onCheckedChange={(checked) => handleInputChange("enableIpBlocking", checked.toString())}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white font-medium">Require Email Verification</Label>
                  <p className="text-sm text-gray-400">Mandate email verification for new users</p>
                </div>
                <Switch
                  checked={formData.requireEmailVerification === "true"}
                  onCheckedChange={(checked) => handleInputChange("requireEmailVerification", checked.toString())}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Status */}
      {hasChanges && (
        <div className="glass-morphism rounded-xl p-4 border border-orange-500/30">
          <div className="flex items-center space-x-3">
            <i className="fas fa-exclamation-triangle text-orange-400"></i>
            <div>
              <p className="text-orange-400 font-medium">Unsaved Changes</p>
              <p className="text-sm text-gray-300">You have unsaved changes. Save or reset to continue.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}