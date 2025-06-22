import { useEffect } from "react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { ChatSystem } from "@/components/chat/chat-system";
import { LeaderboardWidget } from "@/components/leaderboard/leaderboard-widget";
import { WelcomeToast } from "@/components/ui/welcome-toast";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Home() {
  const { connect } = useWebSocket();

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] text-[var(--soft-white)] overflow-x-hidden">
      
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)]"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--midnight)]/80 via-transparent to-transparent"></div>
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[var(--neon-cyan)] rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[var(--gold)] rounded-full animate-pulse-slow opacity-40"></div>
        <div 
          className="absolute top-1/2 left-3/4 w-3 h-3 bg-[var(--soft-purple)] rounded-full animate-float opacity-30"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-50 glass-morphism border-b border-[var(--gold)]/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <i className="fas fa-moon text-3xl text-[var(--gold)] animate-pulse-slow"></i>
            <h1 className="text-2xl font-bold text-white text-shadow">Nightfall Casino</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[var(--soft-white)] hover:text-[var(--gold)] transition-colors duration-300 font-medium">Games</a>
            <a href="#" className="text-[var(--soft-white)] hover:text-[var(--gold)] transition-colors duration-300 font-medium">Sports</a>
            <a href="#" className="text-[var(--soft-white)] hover:text-[var(--gold)] transition-colors duration-300 font-medium">Rewards</a>
            <a href="#" className="text-[var(--soft-white)] hover:text-[var(--gold)] transition-colors duration-300 font-medium">Leaderboard</a>
          </nav>

          {/* Wallet Connection Area */}
          <div className="flex items-center space-x-4">
            <WalletButton />
            <button className="text-gray-400 hover:text-white transition-colors duration-300">
              <i className="fas fa-cog text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-4 text-shadow">
            Welcome to the <span className="text-[var(--gold)]">Night</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the most immersive Solana casino under the starlit sky. Where fortune favors the bold.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[var(--gold)]/50 transform hover:scale-105 transition-all duration-300">
              <i className="fas fa-dice mr-2"></i>
              Start Playing
            </button>
            <button className="glass-morphism text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300">
              <i className="fas fa-chart-line mr-2"></i>
              View Stats
            </button>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Games Section */}
          <div className="lg:col-span-2 glass-morphism rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <i className="fas fa-gamepad text-[var(--gold)] mr-3"></i>
                Featured Games
              </h3>
              <button className="text-[var(--gold)] hover:text-yellow-300 transition-colors duration-300">
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Game Cards */}
              {[
                { name: "Night Dice", rtp: "98.5% RTP", icon: "dice", gradient: "from-purple-600 to-blue-600" },
                { name: "Moonflip", rtp: "50/50 Odds", icon: "coins", gradient: "from-pink-600 to-purple-600" },
                { name: "Crash", rtp: "High Stakes", icon: "chart-line", gradient: "from-green-600 to-teal-600" },
                { name: "Blackjack", rtp: "Classic", icon: "spade", gradient: "from-orange-600 to-red-600" }
              ].map((game, index) => (
                <div key={index} className="game-card glass-morphism rounded-xl p-4 hover:border-[var(--gold)]/50 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                  <div className={`aspect-video bg-gradient-to-br ${game.gradient} rounded-lg mb-3 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2">
                      <i className={`fas fa-${game.icon} text-white text-2xl`}></i>
                    </div>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-[var(--gold)] transition-colors duration-300">{game.name}</h4>
                  <p className="text-sm text-gray-400">{game.rtp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Section */}
          <LeaderboardWidget />
        </div>

        {/* Stats and Chat Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Stats Overview */}
          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-chart-bar text-[var(--gold)] mr-3"></i>
              Night Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Wagered Tonight</span>
                <span className="font-bold text-[var(--gold)]">2,847 SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Players</span>
                <span className="font-bold text-[var(--neon-cyan)]">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Biggest Win</span>
                <span className="font-bold text-green-400">127.8 SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">House Edge</span>
                <span className="font-bold text-white">1.5%</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="font-semibold text-white mb-3">Recent Big Wins</h4>
              <div className="space-y-2">
                {[
                  { player: "MoonWhale", amount: "42.3 SOL" },
                  { player: "NightRider", amount: "18.7 SOL" },
                  { player: "StarPlayer", amount: "35.2 SOL" }
                ].map((win, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{win.player} won</span>
                    <span className="font-bold text-[var(--gold)]">{win.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat System */}
          <ChatSystem />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 glass-morphism border-t border-[var(--gold)]/20">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <i className="fas fa-moon text-2xl text-[var(--gold)]"></i>
                <h3 className="text-xl font-bold text-white">Nightfall Casino</h3>
              </div>
              <p className="text-gray-400 text-sm">The premier Solana gaming destination where the night comes alive.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Games</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Dice Games</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Coin Flip</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Crash</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Blackjack</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Discord</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Telegram</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Responsible Gaming</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--gold)] transition-colors duration-300">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Nightfall Casino. All rights reserved. | Powered by Solana</p>
          </div>
        </div>
      </footer>

      <WelcomeToast />
    </div>
  );
}
