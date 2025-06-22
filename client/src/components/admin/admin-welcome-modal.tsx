import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

interface AdminWelcomeModalProps {
  user: User;
  onClose: () => void;
}

export function AdminWelcomeModal({ user, onClose }: AdminWelcomeModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-[var(--gold)]/50 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white max-w-md">
        <div className="text-center p-6">
          {/* Admin Crown Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--gold)] via-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-[var(--midnight)] mx-auto animate-glow">
              <i className="fas fa-crown text-3xl animate-pulse"></i>
            </div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-[var(--gold)]/30 rounded-full animate-spin mx-auto"></div>
          </div>
          
          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back, Administrator
          </h2>
          
          <div className="mb-4">
            <p className="text-[var(--gold)] font-semibold text-lg">
              {user.username}
            </p>
            <p className="text-gray-300 text-sm">
              You have full administrative access to Nightfall Casino
            </p>
          </div>

          {/* Admin Features Highlight */}
          <div className="bg-[var(--midnight)]/50 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center justify-center">
              <i className="fas fa-shield-alt text-[var(--gold)] mr-2"></i>
              Admin Capabilities
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <i className="fas fa-users text-blue-400"></i>
                <span>User Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-cogs text-green-400"></i>
                <span>Game Settings</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-wallet text-purple-400"></i>
                <span>Fee Wallets</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span>Vouch System</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2 text-red-300">
              <i className="fas fa-exclamation-triangle"></i>
              <span className="text-sm font-medium">Security Reminder</span>
            </div>
            <p className="text-xs text-red-200 mt-1">
              All admin actions are logged and monitored. Use your powers responsibly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
            >
              <i className="fas fa-rocket mr-2"></i>
              Enter Admin Panel
            </Button>
          </div>

          {/* Current Time */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              Admin session started: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}