import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MoonFlipProps {
  onGameComplete?: (result: { isWin: boolean; amount: string }) => void;
}

export function MoonFlip({ onGameComplete }: MoonFlipProps) {
  const { user, solBalance, updateBalance } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("0.001");
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);
  const [showResult, setShowResult] = useState(false);

  const playGameMutation = useMutation({
    mutationFn: async ({ betAmount, side }: { betAmount: string; side: "heads" | "tails" }) => {
      const response = await apiRequest("POST", "/api/games/moon-flip", {
        betAmount,
        selectedSide: side
      });
      return response.json();
    },
    onSuccess: (data) => {
      setFlipResult(data.result);
      setIsFlipping(true);
      
      // Simulate flip animation delay
      setTimeout(() => {
        setIsFlipping(false);
        setShowResult(true);
        
        if (data.isWin) {
          toast({
            title: "🌙 Moon Flip Victory!",
            description: `You won ${data.winAmount} SOL!`,
            className: "bg-green-600 border-green-500 text-white"
          });
        } else {
          toast({
            title: "Moon Flip Result",
            description: `Better luck next time! The coin landed on ${data.result}`,
            className: "bg-gray-600 border-gray-500 text-white"
          });
        }
        
        updateBalance();
        onGameComplete?.(data);
        
        setTimeout(() => {
          setShowResult(false);
          setFlipResult(null);
        }, 3000);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Game Error",
        description: error.message || "Failed to play game",
        variant: "destructive"
      });
      setIsFlipping(false);
    }
  });

  const handlePlay = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to play",
        variant: "destructive"
      });
      return;
    }

    const bet = parseFloat(betAmount);
    if (bet < 0.001) {
      toast({
        title: "Invalid Bet",
        description: "Minimum bet is 0.001 SOL",
        variant: "destructive"
      });
      return;
    }

    if (bet > solBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough SOL",
        variant: "destructive"
      });
      return;
    }

    playGameMutation.mutate({ betAmount, side: selectedSide });
  };

  return (
    <div className="glass-morphism rounded-xl p-8 max-w-md mx-auto">
      {/* Game Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <i className="fas fa-moon text-[var(--gold)] mr-3"></i>
          Moon Flip
        </h2>
        <p className="text-gray-400">Flip the cosmic coin and test your luck</p>
      </div>

      {/* Coin Animation */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div 
            className={`w-32 h-32 rounded-full border-4 border-[var(--gold)] flex items-center justify-center text-4xl transition-all duration-2000 ${
              isFlipping ? 'animate-spin' : ''
            } ${showResult ? (flipResult === selectedSide ? 'shadow-lg shadow-green-400/50' : 'shadow-lg shadow-red-400/50') : 'shadow-lg shadow-[var(--gold)]/50'}`}
            style={{
              background: isFlipping 
                ? 'linear-gradient(45deg, var(--gold), #fbbf24, var(--gold))' 
                : showResult 
                  ? flipResult === "heads" 
                    ? 'linear-gradient(135deg, #1e40af, #3b82f6)'
                    : 'linear-gradient(135deg, #7c3aed, #a855f7)'
                  : 'linear-gradient(135deg, var(--deep-purple), var(--navy))'
            }}
          >
            {isFlipping ? (
              <i className="fas fa-sparkles text-white animate-pulse"></i>
            ) : showResult ? (
              flipResult === "heads" ? (
                <i className="fas fa-rocket text-white"></i>
              ) : (
                <i className="fas fa-moon text-white"></i>
              )
            ) : (
              <i className="fas fa-question text-[var(--gold)]"></i>
            )}
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-[var(--gold)]/20 animate-pulse -z-10 scale-110"></div>
        </div>
      </div>

      {/* Side Selection */}
      <div className="space-y-4 mb-6">
        <Label className="text-white font-semibold">Choose your side:</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={selectedSide === "heads" ? "default" : "ghost"}
            onClick={() => setSelectedSide("heads")}
            disabled={isFlipping}
            className={`h-16 ${selectedSide === "heads" ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-white/10'}`}
          >
            <div className="text-center">
              <i className="fas fa-rocket text-2xl mb-1"></i>
              <div className="text-sm">Heads (🚀)</div>
            </div>
          </Button>
          
          <Button
            variant={selectedSide === "tails" ? "default" : "ghost"}
            onClick={() => setSelectedSide("tails")}
            disabled={isFlipping}
            className={`h-16 ${selectedSide === "tails" ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-white/10'}`}
          >
            <div className="text-center">
              <i className="fas fa-moon text-2xl mb-1"></i>
              <div className="text-sm">Tails (🌙)</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Bet Amount */}
      <div className="space-y-4 mb-6">
        <Label className="text-white font-semibold">Bet Amount (SOL):</Label>
        <Input
          type="number"
          step="0.001"
          min="0.001"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          disabled={isFlipping}
          className="bg-white/5 border-white/10 text-white text-center text-lg"
          placeholder="0.001"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>Min: 0.001 SOL</span>
          <span>Balance: {solBalance.toFixed(3)} SOL</span>
        </div>
      </div>

      {/* Quick Bet Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {["0.001", "0.01", "0.1", "1.0"].map((amount) => (
          <Button
            key={amount}
            variant="ghost"
            size="sm"
            onClick={() => setBetAmount(amount)}
            disabled={isFlipping || parseFloat(amount) > solBalance}
            className="text-[var(--gold)] hover:bg-[var(--gold)]/20"
          >
            {amount}
          </Button>
        ))}
      </div>

      {/* Play Button */}
      <Button
        onClick={handlePlay}
        disabled={isFlipping || playGameMutation.isPending || !user}
        className="w-full h-14 bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold text-lg hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
      >
        {isFlipping ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Flipping...
          </>
        ) : playGameMutation.isPending ? (
          <>
            <i className="fas fa-circle-notch fa-spin mr-2"></i>
            Starting...
          </>
        ) : (
          <>
            <i className="fas fa-play mr-2"></i>
            Flip the Moon Coin
          </>
        )}
      </Button>

      {/* Result Display */}
      {showResult && (
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          flipResult === selectedSide 
            ? 'bg-green-600/20 border-green-500 text-green-100' 
            : 'bg-red-600/20 border-red-500 text-red-100'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {flipResult === selectedSide ? "🎉 You Won!" : "😔 You Lost"}
            </div>
            <div className="text-sm">
              The coin landed on <strong>{flipResult}</strong> ({flipResult === "heads" ? "🚀" : "🌙"})
            </div>
          </div>
        </div>
      )}

      {/* Game Info */}
      <div className="mt-6 p-4 bg-[var(--midnight)]/30 rounded-lg">
        <div className="text-sm text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Win Multiplier:</span>
            <span className="text-[var(--gold)]">2x</span>
          </div>
          <div className="flex justify-between">
            <span>House Edge:</span>
            <span className="text-blue-400">1.5%</span>
          </div>
          <div className="flex justify-between">
            <span>Playing Fee:</span>
            <span className="text-purple-400">0.0001 SOL (winner only)</span>
          </div>
        </div>
      </div>
    </div>
  );
}