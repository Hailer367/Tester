import { useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { UserManagement } from "./user-management";
import { GameStats } from "./game-stats";
import { LeaderboardControl } from "./leaderboard-control";
import { ReportsLogs } from "./reports-logs";
import { ManualAdjustments } from "./manual-adjustments";
import { CasinoSettings } from "./casino-settings";
import { WithdrawalWallets } from "./withdrawal-wallets";
import { VouchSystem } from "./vouch-system";
import { AdminWelcomeModal } from "./admin-welcome-modal";

type AdminSection = 
  | "dashboard" 
  | "users" 
  | "games" 
  | "leaderboard" 
  | "reports" 
  | "adjustments" 
  | "settings" 
  | "wallets" 
  | "vouch";

export function AdminDashboard() {
  const { user } = useWallet();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [showWelcome, setShowWelcome] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "games":
        return <GameStats />;
      case "leaderboard":
        return <LeaderboardControl />;
      case "reports":
        return <ReportsLogs />;
      case "adjustments":
        return <ManualAdjustments />;
      case "settings":
        return <CasinoSettings />;
      case "wallets":
        return <WithdrawalWallets />;
      case "vouch":
        return <VouchSystem />;
      default:
        return (
          <div className="space-y-6">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-white">1,247</p>
                  </div>
                  <i className="fas fa-users text-[var(--gold)] text-2xl"></i>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Online Now</p>
                    <p className="text-2xl font-bold text-green-400">234</p>
                  </div>
                  <i className="fas fa-circle text-green-400 text-2xl"></i>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Volume (24h)</p>
                    <p className="text-2xl font-bold text-[var(--gold)]">2,847 SOL</p>
                  </div>
                  <i className="fas fa-coins text-[var(--gold)] text-2xl"></i>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Games</p>
                    <p className="text-2xl font-bold text-blue-400">156</p>
                  </div>
                  <i className="fas fa-gamepad text-blue-400 text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-bolt text-[var(--gold)] mr-3"></i>
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveSection("users")}
                  className="glass-morphism rounded-lg p-4 hover:border-[var(--gold)]/50 transition-all duration-300 group"
                >
                  <i className="fas fa-user-cog text-[var(--gold)] text-2xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                  <p className="text-white font-semibold">Manage Users</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("settings")}
                  className="glass-morphism rounded-lg p-4 hover:border-[var(--gold)]/50 transition-all duration-300 group"
                >
                  <i className="fas fa-cogs text-[var(--gold)] text-2xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                  <p className="text-white font-semibold">Casino Settings</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("wallets")}
                  className="glass-morphism rounded-lg p-4 hover:border-[var(--gold)]/50 transition-all duration-300 group"
                >
                  <i className="fas fa-wallet text-[var(--gold)] text-2xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                  <p className="text-white font-semibold">Fee Wallets</p>
                </button>
                
                <button 
                  onClick={() => setActiveSection("reports")}
                  className="glass-morphism rounded-lg p-4 hover:border-[var(--gold)]/50 transition-all duration-300 group"
                >
                  <i className="fas fa-chart-line text-[var(--gold)] text-2xl mb-2 group-hover:scale-110 transition-transform duration-300"></i>
                  <p className="text-white font-semibold">View Reports</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-morphism rounded-xl p-6 border border-[var(--gold)]/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-history text-[var(--gold)] mr-3"></i>
                Recent Admin Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: "User ban applied", target: "PlayerXYZ", time: "2 minutes ago" },
                  { action: "House edge updated", target: "Dice Game", time: "15 minutes ago" },
                  { action: "Fee wallet added", target: "Wallet ABC", time: "1 hour ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-dot-circle text-[var(--gold)] text-sm"></i>
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-400">{activity.target}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] flex">
      {/* Admin Sidebar */}
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Admin Header */}
        <AdminHeader />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Admin Welcome Modal */}
      {showWelcome && user && (
        <AdminWelcomeModal 
          user={user}
          onClose={() => setShowWelcome(false)} 
        />
      )}

      {/* Admin Mascot */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="glass-morphism rounded-full p-4 border border-[var(--gold)]/30 animate-float">
          <i className="fas fa-user-ninja text-[var(--gold)] text-2xl"></i>
        </div>
      </div>
    </div>
  );
}