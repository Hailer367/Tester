import { useState } from "react";
import { useWallet } from "./wallet-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsernameModal({ isOpen, onClose }: UsernameModalProps) {
  const { publicKey, setShowWelcome } = useWallet();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState("purple");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    { id: "purple", gradient: "from-purple-500 to-pink-500" },
    { id: "blue", gradient: "from-blue-500 to-cyan-500" },
    { id: "green", gradient: "from-green-500 to-emerald-500" },
    { id: "orange", gradient: "from-orange-500 to-red-500" },
    { id: "gold", gradient: "from-[var(--gold)] to-yellow-400" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      toast({
        title: "Error",
        description: "No wallet connected",
        variant: "destructive"
      });
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast({
        title: "Invalid username",
        description: "Username must be between 3 and 20 characters",
        variant: "destructive"
      });
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      toast({
        title: "Invalid username",
        description: "Username can only contain letters and numbers",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("POST", "/api/users/register", {
        username,
        walletAddress: publicKey.toString(),
        avatar: username[0].toUpperCase(),
        profileColor: selectedColor
      });

      const user = await response.json();
      
      // Update local storage and trigger re-render
      localStorage.setItem("user", JSON.stringify(user));
      window.location.reload(); // Simple way to update the wallet context
      
      onClose();
      setShowWelcome(true);
      
      toast({
        title: "Registration complete!",
        description: `Welcome to Nightfall Casino, ${username}!`,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to register username",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-[var(--gold)]/30 bg-[var(--deep-purple)]/90 backdrop-blur-lg text-white max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-3">
            <i className="fas fa-user-edit text-4xl text-[var(--gold)]"></i>
          </div>
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            Choose Your Night Name
          </DialogTitle>
          <p className="text-gray-400">Select a username to complete your registration</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </Label>
            <Input
              type="text"
              placeholder="Enter your night alias..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50"
            />
            <p className="text-xs text-gray-400 mt-1">3-20 characters, letters and numbers only</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Color
            </Label>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-10 h-10 bg-gradient-to-br ${color.gradient} rounded-full border-2 transition-all duration-300 ${
                    selectedColor === color.id 
                      ? "border-[var(--gold)] scale-110" 
                      : "border-transparent hover:border-[var(--gold)]"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center space-x-3 p-3 glass-morphism rounded-lg">
            <div 
              className={`w-12 h-12 bg-gradient-to-br ${colors.find(c => c.id === selectedColor)?.gradient} rounded-full flex items-center justify-center text-[var(--midnight)] font-bold text-lg`}
            >
              {username[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-semibold text-white">{username || "Your Username"}</div>
              <div className="text-sm text-gray-400">Preview</div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 glass-morphism border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || username.length < 3}
              className="flex-1 bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold hover:shadow-lg hover:shadow-[var(--gold)]/50"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
