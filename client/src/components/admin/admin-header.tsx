import { useWallet } from "@/components/wallet/wallet-provider";
import { formatWalletAddress } from "@/lib/wallet-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AdminHeader() {
  const { user, disconnect, solBalance } = useWallet();

  return (
    <header className="h-16 bg-[var(--midnight)]/60 backdrop-blur-lg border-b border-[var(--gold)]/20 flex items-center justify-between px-6">
      {/* Left side - Current time and status */}
      <div className="flex items-center space-x-6">
        <div className="text-white">
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-gray-400">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center space-x-4">
          <div className="glass-morphism rounded-lg px-3 py-1">
            <div className="flex items-center space-x-2">
              <i className="fas fa-circle text-green-400 text-xs animate-pulse"></i>
              <span className="text-sm text-white">Online</span>
            </div>
          </div>
          
          <div className="glass-morphism rounded-lg px-3 py-1">
            <div className="flex items-center space-x-2">
              <i className="fas fa-users text-[var(--gold)] text-xs"></i>
              <span className="text-sm text-white">234 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Admin profile and actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-[var(--gold)] transition-colors duration-300">
          <i className="fas fa-bell text-lg"></i>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">3</span>
          </span>
        </button>

        {/* Settings */}
        <button className="text-gray-400 hover:text-[var(--gold)] transition-colors duration-300">
          <i className="fas fa-cog text-lg"></i>
        </button>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-3 glass-morphism rounded-lg px-4 py-2 hover:border-[var(--gold)]/50 transition-all duration-300 group">
              {/* Admin Badge */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-[var(--gold)]">
                  <i className="fas fa-crown text-sm"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--gold)] rounded-full flex items-center justify-center">
                  <i className="fas fa-shield-alt text-[var(--midnight)] text-xs"></i>
                </div>
              </div>
              
              {/* Admin Info */}
              <div className="text-left">
                <div className="text-sm font-semibold text-white flex items-center">
                  {user?.username}
                  <i className="fas fa-crown text-[var(--gold)] text-xs ml-2"></i>
                </div>
                <div className="text-xs text-gray-400">
                  {user?.walletAddress ? formatWalletAddress(user.walletAddress) : ''}
                </div>
              </div>
              
              {/* SOL Balance */}
              <div className="text-right">
                <div className="text-sm font-semibold text-[var(--gold)]">
                  {solBalance.toFixed(3)} SOL
                </div>
                <div className="text-xs text-gray-400">Admin Balance</div>
              </div>
              
              <i className="fas fa-chevron-down text-gray-400 group-hover:text-white transition-colors duration-300"></i>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-64 glass-morphism border-[var(--gold)]/30 bg-[var(--deep-purple)]/80 backdrop-blur-lg">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-[var(--gold)]">
                  <i className="fas fa-crown"></i>
                </div>
                <div>
                  <div className="font-semibold text-white flex items-center">
                    {user?.username}
                    <span className="ml-2 text-xs bg-[var(--gold)] text-[var(--midnight)] px-2 py-1 rounded-full font-bold">ADMIN</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {user?.walletAddress ? formatWalletAddress(user.walletAddress) : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
              <i className="fas fa-user-cog text-gray-400 mr-2"></i>
              Admin Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
              <i className="fas fa-key text-gray-400 mr-2"></i>
              Security Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
              <i className="fas fa-history text-gray-400 mr-2"></i>
              Admin Activity Log
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem 
              className="hover:bg-red-500/20 focus:bg-red-500/20 text-red-400"
              onClick={disconnect}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout from Admin Panel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}