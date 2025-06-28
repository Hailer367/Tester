import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Gamepad2,
  Trophy,
  Users,
  MessageSquare,
  ShoppingBag,
  Settings,
  Shield,
  Moon,
  Star,
  Coins,
  TrendingUp,
  Clock,
  Volume2,
  VolumeX,
  Menu,
  X,
  User,
  Wallet,
  ChevronDown,
  Crown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainNavProps {
  onlineCount?: number;
  userBalance?: string;
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
  onOpenSettings?: () => void;
  onOpenShop?: () => void;
  className?: string;
}

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
    description: "Casino lobby and overview"
  },
  {
    id: "games",
    label: "Games",
    icon: Gamepad2,
    href: "/games",
    description: "All available games",
    badge: "7 Games"
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    href: "/leaderboard",
    description: "Top players and statistics"
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    href: "/chat",
    description: "Community discussions"
  }
];

const QUICK_ACTIONS = [
  {
    id: "shop",
    label: "Shop",
    icon: ShoppingBag,
    description: "Cosmetics and unlockables",
    accent: "neon-cyan"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences and configuration",
    accent: "purple"
  }
];

export function MainNav({ 
  onlineCount = 0, 
  userBalance = "0", 
  isWalletConnected = false,
  onConnectWallet,
  onOpenSettings,
  onOpenShop,
  className 
}: MainNavProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className={cn("border-b border-gray-800/50 bg-black/20 backdrop-blur-sm sticky top-0 z-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <Moon className="h-8 w-8 text-[var(--neon-cyan)] group-hover:text-[var(--gold)] transition-colors" />
                <Star className="h-3 w-3 text-[var(--gold)] absolute -top-1 -right-1 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-[var(--neon-cyan)] to-purple-400 bg-clip-text text-transparent">
                  Nightfall
                </div>
                <div className="text-xs text-gray-400 -mt-1">Casino</div>
              </div>
            </div>
          </Link>

          {/* Main Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-all duration-200 group",
                      active 
                        ? "text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 hover:bg-[var(--neon-cyan)]/20" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 mr-2 transition-transform group-hover:scale-110",
                      active && "text-[var(--neon-cyan)]"
                    )} />
                    {item.label}
                    {item.badge && (
                      <Badge className="ml-2 text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {item.badge}
                      </Badge>
                    )}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--neon-cyan)]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Online Counter */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-gray-300">{onlineCount}</span>
            </div>

            {/* Sound Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isSoundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const onClick = action.id === "shop" ? onOpenShop : onOpenSettings;
                
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={onClick}
                    className="p-2 text-gray-400 hover:text-white group"
                    title={action.description}
                  >
                    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                );
              })}
            </div>

            {/* Wallet Section */}
            <div className="flex items-center gap-3">
              {isWalletConnected ? (
                <div className="flex items-center gap-3">
                  {/* Balance Display */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-[var(--gold)]/10 rounded-lg border border-[var(--gold)]/20">
                    <Coins className="h-4 w-4 text-[var(--gold)]" />
                    <span className="text-sm font-medium text-[var(--gold)]">
                      {parseFloat(userBalance).toFixed(4)} SOL
                    </span>
                  </div>
                  
                  {/* Profile Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={onConnectWallet}
                  className="bg-gradient-to-r from-[var(--neon-cyan)] to-purple-500 hover:from-[var(--neon-cyan)]/80 hover:to-purple-500/80 text-black font-semibold"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800/50 py-4"
          >
            <div className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-4 py-3 text-left",
                        active 
                          ? "text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10" 
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.description}</div>
                      </div>
                      {item.badge && (
                        <Badge className="ml-auto text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              {/* Mobile Quick Actions */}
              <div className="pt-4 border-t border-gray-800/50">
                <div className="text-xs font-medium text-gray-400 px-4 mb-2 uppercase tracking-wide">
                  Quick Actions
                </div>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  const onClick = action.id === "shop" ? onOpenShop : onOpenSettings;
                  
                  return (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="w-full justify-start px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-gray-800/50"
                      onClick={() => {
                        onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-gray-400">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}