import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";

export function WelcomeToast() {
  const { user, showWelcome, setShowWelcome } = useWallet();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showWelcome && user) {
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome, user]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowWelcome(false);
    }, 300);
  };

  if (!showWelcome || !user) return null;

  return (
    <div 
      className={`fixed top-20 right-6 z-50 glass-morphism rounded-lg p-4 border border-[var(--gold)]/30 transition-all duration-300 ${
        isVisible ? "animate-fadeIn opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <div className="flex items-center space-x-3">
        <i className="fas fa-moon text-[var(--gold)] text-xl"></i>
        <div>
          <div className="font-semibold text-white">
            Welcome back, {user.username}! 🌙
          </div>
          <div className="text-sm text-gray-400">
            Ready for another night of gaming?
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
