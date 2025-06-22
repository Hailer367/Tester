import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminAuth } from "@/components/admin/admin-auth";
import { isAuthorizedAdmin } from "@/lib/admin-utils";

export default function AdminPanel() {
  const { user, connected } = useWallet();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!connected || !user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        const authorized = await isAuthorizedAdmin(user.walletAddress);
        setIsAuthorized(authorized);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [connected, user]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[var(--gold)] mb-4"></i>
          <p className="text-white text-lg">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!connected || !user) {
    return <AdminAuth />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)] flex items-center justify-center">
        <div className="glass-morphism rounded-2xl p-8 text-center max-w-md">
          <i className="fas fa-shield-alt text-red-400 text-6xl mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            Your wallet address is not authorized to access the admin panel.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
          >
            Return to Casino
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}