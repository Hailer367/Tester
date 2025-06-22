import { useState } from "react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: "fas fa-chart-pie", label: "Dashboard" },
    { id: "users", icon: "fas fa-users", label: "User Management" },
    { id: "games", icon: "fas fa-gamepad", label: "Game Stats" },
    { id: "leaderboard", icon: "fas fa-trophy", label: "Leaderboard" },
    { id: "reports", icon: "fas fa-file-alt", label: "Reports & Logs" },
    { id: "adjustments", icon: "fas fa-tools", label: "Manual Adjustments" },
    { id: "settings", icon: "fas fa-cogs", label: "Casino Settings" },
    { id: "wallets", icon: "fas fa-wallet", label: "Fee Wallets" },
    { id: "vouch", icon: "fas fa-star", label: "Vouch System" },
  ];

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} bg-[var(--midnight)]/80 backdrop-blur-lg border-r border-[var(--gold)]/20 transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <i className="fas fa-user-shield text-[var(--gold)] text-2xl"></i>
              <div>
                <h2 className="text-white font-bold">Admin Panel</h2>
                <p className="text-xs text-gray-400">Nightfall Casino</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-[var(--gold)] transition-colors duration-300"
          >
            <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 group ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-[var(--gold)]/20 to-yellow-400/20 border border-[var(--gold)]/30 text-[var(--gold)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <i className={`${item.icon} text-lg ${activeSection === item.id ? 'text-[var(--gold)]' : 'group-hover:text-[var(--gold)]'} transition-colors duration-300`}></i>
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[var(--gold)]/20">
        {!collapsed && (
          <div className="glass-morphism rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <i className="fas fa-shield-check text-green-400"></i>
              <div>
                <p className="text-sm text-white font-medium">System Status</p>
                <p className="text-xs text-green-400">All Systems Online</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}