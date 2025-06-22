import { useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { ChatSystem } from "@/components/chat/chat-system";
import { LeaderboardWidget } from "@/components/leaderboard/leaderboard-widget";
import { GameLobby } from "@/components/games/game-lobby";
import { SoundManager } from "@/components/sound/sound-manager";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { connected } = useWallet();
  const [showChat, setShowChat] = useState(false);
  const [activeView, setActiveView] = useState<"home" | "games" | "settings">("home");

  if (activeView === "games") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gold)] rounded-full opacity-60 animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-40 animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-purple-300 rounded-full opacity-30 animate-float" style={{ animationDelay: "4s" }}></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[var(--gold)] rounded-full opacity-50 animate-float" style={{ animationDelay: "6s" }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8 text-center">
            <Button
              onClick={() => setActiveView("home")}
              variant="ghost"
              className="text-[var(--gold)] hover:text-yellow-300"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Home
            </Button>
          </div>

          <GameLobby />
        </div>
      </div>
    );
  }

  if (activeView === "settings") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8 text-center">
            <Button
              onClick={() => setActiveView("home")}
              variant="ghost"
              className="text-[var(--gold)] hover:text-yellow-300"
            >
              <i className="fas fa-home mr-2"></i>
              Back to Home
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <SoundManager />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--gold)] rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-40 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-purple-300 rounded-full opacity-30 animate-float" style={{ animationDelay: "4s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[var(--gold)] rounded-full opacity-50 animate-float" style={{ animationDelay: "6s" }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 animate-glow">
            Nightfall Casino
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Where night legends are born
          </p>
          
          {!connected && (
            <div className="glass-morphism rounded-2xl p-8 max-w-md mx-auto">
              <div className="mb-6">
                <i className="fas fa-moon text-6xl text-[var(--gold)] mb-4 animate-glow"></i>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to the Night
                </h2>
                <p className="text-gray-400">
                  Connect your Solana wallet to begin your casino journey
                </p>
              </div>
            </div>
          )}
        </header>

        {connected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main game area */}
            <div className="lg:col-span-2">
              <div className="glass-morphism rounded-2xl p-8 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-dice text-6xl text-[var(--gold)] mb-6 animate-pulse"></i>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to Play?
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Enter the game lobby and test your luck!
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                    <div className="glass-morphism rounded-lg p-4">
                      <i className="fas fa-moon text-[var(--gold)] text-2xl mb-2"></i>
                      <div className="text-white font-semibold">Moon Flip</div>
                      <div className="text-xs text-gray-400">Cosmic coin flip</div>
                    </div>
                    <div className="glass-morphism rounded-lg p-4">
                      <i className="fas fa-dice text-[var(--gold)] text-2xl mb-2"></i>
                      <div className="text-white font-semibold">Snake & Ladder</div>
                      <div className="text-xs text-gray-400">Race to 100</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setActiveView("games")}
                    className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold text-lg px-8 py-3 hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Enter Game Lobby
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <LeaderboardWidget />
              
              {/* Quick actions */}
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-rocket text-[var(--gold)] mr-3"></i>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setActiveView("games")}
                    className="w-full glass-morphism hover:bg-white/10 text-white justify-start"
                    variant="ghost"
                  >
                    <i className="fas fa-gamepad mr-3 text-[var(--gold)]"></i>
                    Game Lobby
                  </Button>
                  <Button 
                    onClick={() => setShowChat(!showChat)}
                    className="w-full glass-morphism hover:bg-white/10 text-white justify-start"
                    variant="ghost"
                  >
                    <i className="fas fa-comments mr-3 text-blue-400"></i>
                    {showChat ? "Hide Chat" : "Show Chat"}
                  </Button>
                  <Button 
                    onClick={() => setActiveView("settings")}
                    className="w-full glass-morphism hover:bg-white/10 text-white justify-start"
                    variant="ghost"
                  >
                    <i className="fas fa-cog mr-3 text-purple-400"></i>
                    Sound Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat overlay */}
        {showChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-4xl h-3/4 m-4">
              <ChatSystem onClose={() => setShowChat(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}