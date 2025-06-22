import { WalletButton } from "@/components/wallet/wallet-button";

export function AdminAuth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] flex items-center justify-center">
      <div className="glass-morphism rounded-2xl p-8 text-center max-w-md border border-[var(--gold)]/30">
        <div className="mb-6">
          <i className="fas fa-user-shield text-6xl text-[var(--gold)] mb-4 animate-glow"></i>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-300">
            Connect your authorized admin wallet to access the control panel
          </p>
        </div>

        <div className="mb-6">
          <WalletButton />
        </div>

        <div className="text-sm text-gray-400">
          <p className="mb-2">
            <i className="fas fa-lock mr-2"></i>
            Secure admin access required
          </p>
          <p>
            <i className="fas fa-shield-alt mr-2"></i>
            Only authorized wallets permitted
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button 
            onClick={() => window.location.href = "/"}
            className="text-[var(--gold)] hover:text-yellow-300 transition-colors duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Casino
          </button>
        </div>
      </div>
    </div>
  );
}