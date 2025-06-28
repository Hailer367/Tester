import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Check, ArrowRight, AlertCircle, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { WebsiteIcon } from "./website-icon";

interface RegistrationFlowProps {
  isOpen: boolean;
  onComplete: (userData: { username: string; avatar: string; termsAccepted: boolean }) => void;
  onClose: () => void;
}

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export function RegistrationFlow({ isOpen, onComplete, onClose }: RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    username: "",
    avatar: "",
    termsAccepted: false,
    privacyAccepted: false,
    ageConfirmed: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const avatarOptions = ["🎭", "🌙", "⭐", "🎲", "🃏", "👤", "🎯", "🔮", "🌟", "💎", "🎪", "🦇", "🌌", "🎰", "♠️", "♦️"];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Terms & Privacy
        if (!userData.termsAccepted) {
          newErrors.terms = "You must accept the Terms of Service to continue";
        }
        if (!userData.privacyAccepted) {
          newErrors.privacy = "You must accept the Privacy Policy to continue";
        }
        if (!userData.ageConfirmed) {
          newErrors.age = "You must confirm you are 18+ years old";
        }
        break;
      case 2: // Username
        if (!userData.username) {
          newErrors.username = "Username is required";
        } else if (userData.username.length < 3) {
          newErrors.username = "Username must be at least 3 characters long";
        } else if (userData.username.length > 20) {
          newErrors.username = "Username must be 20 characters or less";
        } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
          newErrors.username = "Username can only contain letters, numbers, and underscores";
        }
        break;
      case 3: // Avatar
        if (!userData.avatar) {
          newErrors.avatar = "Please select an avatar";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Registration complete
        onComplete(userData);
        toast({
          title: "Welcome to Nightfall Casino!",
          description: "Your account has been created successfully.",
        });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Welcome Step Component
  const WelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center">
        <WebsiteIcon size={80} animated />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Welcome to Nightfall Casino</h2>
        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed max-w-md mx-auto">
          Experience the thrill of anime-inspired gambling in the neon-lit streets of our digital casino.
        </p>
      </div>

      <Alert className="border-[var(--primary)]/30 bg-[var(--primary)]/10 text-left">
        <AlertCircle className="h-4 w-4 text-[var(--primary)]" />
        <AlertDescription className="text-[var(--primary)]">
          <strong>Important:</strong> You must be 18+ years old and agree to our terms before playing any games or wagering SOL.
        </AlertDescription>
      </Alert>

      <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
        <p>✓ Connect your Solana wallet securely</p>
        <p>✓ Choose your unique username and avatar</p>
        <p>✓ Start playing Moon Flip and Snake & Ladder</p>
        <p>✓ Earn achievements and unlock shop items</p>
      </div>
    </motion.div>
  );

  // Terms & Privacy Step Component
  const TermsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg w-fit mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Legal Agreement</h2>
        <p className="text-[var(--muted-foreground)]">
          Please read and accept our terms to continue
        </p>
      </div>

      <div className="space-y-4">
        <Card className="bg-[var(--muted)]/20 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={userData.termsAccepted}
                onCheckedChange={(checked) => setUserData({...userData, termsAccepted: !!checked})}
              />
              <div className="space-y-2">
                <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I have read and accept the <a href="/terms" target="_blank" className="text-[var(--primary)] hover:underline">Terms of Service</a>
                </Label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Includes rules about gameplay, betting, winnings, and platform usage
                </p>
              </div>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-xs mt-2 ml-6">{errors.terms}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[var(--muted)]/20 border-[var(--border)]">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={userData.privacyAccepted}
                onCheckedChange={(checked) => setUserData({...userData, privacyAccepted: !!checked})}
              />
              <div className="space-y-2">
                <Label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                  I have read and accept the <a href="/privacy" target="_blank" className="text-[var(--primary)] hover:underline">Privacy Policy</a>
                </Label>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Explains how we collect, use, and protect your data
                </p>
              </div>
            </div>
            {errors.privacy && (
              <p className="text-red-400 text-xs mt-2 ml-6">{errors.privacy}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="age"
                checked={userData.ageConfirmed}
                onCheckedChange={(checked) => setUserData({...userData, ageConfirmed: !!checked})}
              />
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium cursor-pointer text-amber-200">
                  I confirm that I am 18 years of age or older
                </Label>
                <p className="text-xs text-amber-300">
                  You must be of legal gambling age to use this platform
                </p>
              </div>
            </div>
            {errors.age && (
              <p className="text-red-400 text-xs mt-2 ml-6">{errors.age}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  // Username Step Component
  const UsernameStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="p-3 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] rounded-lg w-fit mx-auto mb-4">
          <User className="w-8 h-8 text-[var(--primary-foreground)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Choose Your Username</h2>
        <p className="text-[var(--muted-foreground)]">
          This will be your public identity in the casino
        </p>
      </div>

      <div className="max-w-sm mx-auto">
        <Label htmlFor="username" className="text-sm font-medium">Username</Label>
        <Input
          id="username"
          value={userData.username}
          onChange={(e) => setUserData({...userData, username: e.target.value})}
          placeholder="Enter your username"
          className="bg-[var(--background)] border-[var(--border)] mt-2"
          maxLength={20}
        />
        {errors.username && (
          <p className="text-red-400 text-xs mt-2">{errors.username}</p>
        )}
        <div className="mt-2 text-xs text-[var(--muted-foreground)] space-y-1">
          <p>• 3-20 characters long</p>
          <p>• Letters, numbers, and underscores only</p>
          <p>• Must be unique (we'll check this for you)</p>
        </div>
      </div>
    </motion.div>
  );

  // Avatar Step Component
  const AvatarStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg w-fit mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Pick Your Avatar</h2>
        <p className="text-[var(--muted-foreground)]">
          Choose an emoji that represents you in the casino
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-4 gap-3">
          {avatarOptions.map((emoji) => (
            <motion.button
              key={emoji}
              onClick={() => setUserData({...userData, avatar: emoji})}
              className={`
                p-4 text-3xl border-2 rounded-lg transition-all duration-200
                ${userData.avatar === emoji 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/20 scale-110' 
                  : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/30'
                }
              `}
              whileHover={{ scale: userData.avatar === emoji ? 1.1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
        {errors.avatar && (
          <p className="text-red-400 text-xs mt-4 text-center">{errors.avatar}</p>
        )}
      </div>

      {userData.avatar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
            <div className="text-2xl">{userData.avatar}</div>
            <div>
              <p className="font-medium text-[var(--foreground)]">{userData.username}</p>
              <p className="text-sm text-[var(--muted-foreground)]">This is how you'll appear to others</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const steps: RegistrationStep[] = [
    { id: "welcome", title: "Welcome", description: "Getting started", component: WelcomeStep },
    { id: "terms", title: "Legal", description: "Terms & Privacy", component: TermsStep },
    { id: "username", title: "Identity", description: "Choose username", component: UsernameStep },
    { id: "avatar", title: "Avatar", description: "Pick your look", component: AvatarStep }
  ];

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Registration Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-[var(--card)] via-[var(--background)] to-[var(--card)] border border-[var(--border)] rounded-xl z-50 overflow-hidden"
          >
            {/* Progress Header */}
            <div className="bg-[var(--card)]/95 backdrop-blur-sm border-b border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-[var(--foreground)]">Account Registration</h1>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-[var(--muted)]/30 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Step Labels */}
              <div className="flex justify-between mt-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`text-xs ${
                      index <= currentStep ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {step.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                {CurrentStepComponent && <CurrentStepComponent />}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] p-6">
              <div className="flex justify-between max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  onClick={currentStep === 0 ? onClose : prevStep}
                  className="flex items-center gap-2"
                >
                  {currentStep === 0 ? "Cancel" : "Previous"}
                </Button>

                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] text-[var(--primary-foreground)] flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete Registration
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}