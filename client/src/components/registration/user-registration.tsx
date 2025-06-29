import { useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  Star, 
  Shield, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Moon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface RegistrationData {
  username: string;
  avatar: string;
  profileColor: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

const avatarOptions = [
  { value: "M", label: "🌙 Moon" },
  { value: "S", label: "⭐ Star" },
  { value: "N", label: "🌃 Night" },
  { value: "D", label: "💎 Diamond" },
  { value: "C", label: "🎰 Casino" },
  { value: "F", label: "🔥 Fire" },
  { value: "L", label: "⚡ Lightning" },
  { value: "W", label: "🌊 Wave" },
  { value: "H", label: "❤️ Heart" },
  { value: "K", label: "👑 Crown" }
];

const profileColors = [
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
  { value: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { value: "yellow", label: "Gold", color: "bg-yellow-500" }
];

export function UserRegistration({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    avatar: "M",
    profileColor: "purple",
    termsAccepted: false,
    privacyAccepted: false
  });

  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept both Terms of Service and Privacy Policy to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/users/register", {
        username: formData.username.trim(),
        avatar: formData.avatar,
        profileColor: formData.profileColor,
        walletAddress: publicKey?.toString()
      });

      const user = await response.json();
      
      // Save user data
      localStorage.setItem("user", JSON.stringify(user));
      
      setShowWelcome(true);
      
      toast({
        title: "Welcome to Nightfall Casino!",
        description: "Your account has been created successfully.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const WelcomeModal = () => (
    <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[var(--gold)] text-center flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Welcome to the Night!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--gold)] to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-black">
              {formData.avatar}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              Welcome, {formData.username}!
            </h3>
            <p className="text-gray-300">
              You've successfully joined Nightfall Casino. Your journey into the anime-themed night begins now.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-[var(--gold)]">Quick Tour</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Games</span>
                </div>
                <p className="text-gray-400">Play Moon Flip, Dice Duel, Snake & Ladder, and more!</p>
              </div>
              
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[var(--gold)]" />
                  <span className="font-semibold">Shop</span>
                </div>
                <p className="text-gray-400">Unlock titles, borders, and effects through gameplay.</p>
              </div>
              
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="font-semibold">Safety</span>
                </div>
                <p className="text-gray-400">Only winners pay fees. Your wallet stays secure.</p>
              </div>
              
              <div className="p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="font-semibold">Community</span>
                </div>
                <p className="text-gray-400">Chat with players and climb the leaderboards.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={() => {
                setShowWelcome(false);
                onClose();
              }}
              className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80 px-8 py-3 text-lg font-semibold"
            >
              Start Gaming!
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Dialog open={isOpen && !showWelcome} onOpenChange={onClose}>
        <DialogContent className="max-w-md bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[var(--gold)] flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Create Account
            </DialogTitle>
          </DialogHeader>
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Welcome to Nightfall Casino! Let's set up your profile.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Choose Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    className="bg-black/40"
                    maxLength={20}
                  />
                  <p className="text-xs text-gray-400 mt-1">3-20 characters, unique across the platform</p>
                </div>
                
                <div>
                  <Label>Choose Avatar</Label>
                  <Select value={formData.avatar} onValueChange={(value) => setFormData(prev => ({ ...prev, avatar: value }))}>
                    <SelectTrigger className="bg-black/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {avatarOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Profile Color</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {profileColors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setFormData(prev => ({ ...prev, profileColor: color.value }))}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          formData.profileColor === color.value 
                            ? 'border-[var(--gold)]' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full mx-auto ${color.color}`} />
                        <span className="text-xs mt-1 block">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.username.trim()}
                className="w-full bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80"
              >
                Continue
              </Button>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Terms & Privacy</h3>
                <p className="text-gray-300 text-sm">
                  Please review and accept our terms to continue.
                </p>
              </div>
              
              <div className="space-y-4">
                <Card className="bg-black/30 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
                      />
                      <div className="flex-1">
                        <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                          I accept the Terms of Service *
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Includes age verification (18+), game rules, and fee structure.
                        </p>
                        <Button variant="link" asChild className="h-auto p-0 text-blue-400 text-xs">
                          <a href="/terms" target="_blank">Read Terms</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privacyAccepted: !!checked }))}
                      />
                      <div className="flex-1">
                        <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                          I accept the Privacy Policy *
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Covers data collection, wallet security, and usage tracking.
                        </p>
                        <Button variant="link" asChild className="h-auto p-0 text-blue-400 text-xs">
                          <a href="/privacy" target="_blank">Read Privacy Policy</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-orange-200">
                      <p className="font-semibold mb-1">Important:</p>
                      <p>You must be 18+ and gambling must be legal in your jurisdiction. Only bet what you can afford to lose.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.termsAccepted || !formData.privacyAccepted}
                  className="flex-1 bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                      Creating...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <WelcomeModal />
    </>
  );
}