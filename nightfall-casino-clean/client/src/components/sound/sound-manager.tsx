import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SoundManagerProps {
  className?: string;
}

type SoundPack = "night_ambience" | "arcade_mode" | "mystery_fog" | "none";

export function SoundManager({ className }: SoundManagerProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundPack, setSoundPack] = useState<SoundPack>("night_ambience");
  const [volume, setVolume] = useState([30]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const soundPacks = [
    {
      id: "night_ambience" as const,
      name: "Night Ambience",
      description: "Gentle wind and distant city sounds",
      icon: "fas fa-cloud-moon"
    },
    {
      id: "arcade_mode" as const,
      name: "Arcade Mode",
      description: "Retro chimes and electronic blips",
      icon: "fas fa-gamepad"
    },
    {
      id: "mystery_fog" as const,
      name: "Mystery Fog",
      description: "Low ambient hum with ethereal tones",
      icon: "fas fa-eye"
    },
    {
      id: "none" as const,
      name: "Silent",
      description: "No background sounds",
      icon: "fas fa-volume-mute"
    }
  ];

  // Load sound pack
  useEffect(() => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    if (!soundEnabled || soundPack === "none") {
      return;
    }

    // In a real implementation, you would load actual audio files
    // For now, we'll simulate the sound system
    console.log(`Loading sound pack: ${soundPack} at volume ${volume[0]}%`);
    
    // Simulate loading background audio
    // const audio = new Audio(`/sounds/background/${soundPack}.mp3`);
    // audio.loop = true;
    // audio.volume = volume[0] / 100;
    // audio.play().catch(console.error);
    // setCurrentAudio(audio);

  }, [soundEnabled, soundPack, volume]);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      soundEnabled,
      soundPack,
      volume: volume[0]
    };
    localStorage.setItem("nightfall_sound_preferences", JSON.stringify(preferences));
  }, [soundEnabled, soundPack, volume]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nightfall_sound_preferences");
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setSoundEnabled(preferences.soundEnabled ?? true);
        setSoundPack(preferences.soundPack ?? "night_ambience");
        setVolume([preferences.volume ?? 30]);
      } catch (error) {
        console.error("Failed to load sound preferences:", error);
      }
    }
  }, []);

  // Play sound effect (for UI interactions)
  const playSoundEffect = (effect: "click" | "win" | "lose" | "notification") => {
    if (!soundEnabled) return;

    console.log(`Playing sound effect: ${effect}`);
    
    // In a real implementation:
    // const audio = new Audio(`/sounds/effects/${effect}.mp3`);
    // audio.volume = (volume[0] / 100) * 0.5; // Effects at half background volume
    // audio.play().catch(console.error);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  return (
    <div className={`glass-morphism rounded-xl p-6 ${className}`}>
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <i className="fas fa-volume-up text-[var(--gold)] mr-3"></i>
        Sound Settings
      </h3>

      <div className="space-y-6">
        {/* Master Sound Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white font-medium">Enable Sounds</Label>
            <p className="text-sm text-gray-400">Master sound toggle</p>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>

        {soundEnabled && (
          <>
            {/* Volume Control */}
            <div>
              <Label className="text-white font-medium mb-3 block">
                Volume: {volume[0]}%
              </Label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Sound Pack Selection */}
            <div>
              <Label className="text-white font-medium mb-3 block">Background Ambience</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {soundPacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSoundPack(pack.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      soundPack === pack.id
                        ? "border-[var(--gold)] bg-[var(--gold)]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <i className={`${pack.icon} text-[var(--gold)]`}></i>
                      <span className="text-white font-semibold">{pack.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">{pack.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects Test */}
            <div>
              <Label className="text-white font-medium mb-3 block">Test Sound Effects</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "click", name: "Click", icon: "fas fa-mouse" },
                  { id: "win", name: "Win", icon: "fas fa-trophy" },
                  { id: "lose", name: "Lose", icon: "fas fa-frown" },
                  { id: "notification", name: "Notification", icon: "fas fa-bell" }
                ].map((effect) => (
                  <Button
                    key={effect.id}
                    size="sm"
                    variant="ghost"
                    onClick={() => playSoundEffect(effect.id as any)}
                    className="text-[var(--gold)] hover:bg-[var(--gold)]/20"
                  >
                    <i className={`${effect.icon} mr-2`}></i>
                    {effect.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Current Playing */}
            {soundPack !== "none" && (
              <div className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[var(--gold)] rounded-full flex items-center justify-center">
                    <i className="fas fa-music text-[var(--midnight)]"></i>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Now Playing</div>
                    <div className="text-sm text-gray-400">
                      {soundPacks.find(p => p.id === soundPack)?.name} - {volume[0]}% volume
                    </div>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-3 bg-[var(--gold)] rounded animate-pulse"></div>
                    <div className="w-1 h-4 bg-[var(--gold)] rounded animate-pulse" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1 h-2 bg-[var(--gold)] rounded animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-1 h-5 bg-[var(--gold)] rounded animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Export utility functions for use throughout the app
export const useSoundEffects = () => {
  const playSoundEffect = (effect: "click" | "win" | "lose" | "notification") => {
    const preferences = localStorage.getItem("nightfall_sound_preferences");
    if (preferences) {
      try {
        const { soundEnabled } = JSON.parse(preferences);
        if (soundEnabled) {
          console.log(`Playing sound effect: ${effect}`);
          // In a real implementation, play the actual sound file
        }
      } catch (error) {
        console.error("Failed to play sound effect:", error);
      }
    }
  };

  return { playSoundEffect };
};