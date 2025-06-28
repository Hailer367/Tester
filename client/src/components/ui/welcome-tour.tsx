import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Gamepad2, 
  ShoppingBag, 
  Users, 
  MessageCircle,
  Settings,
  Trophy,
  Coins,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WelcomeTourProps {
  isOpen: boolean;
  onComplete: () => void;
  username: string;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  highlight: string;
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  content: string[];
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Nightfall Casino!",
    description: "Let's take a quick tour of your new digital gambling paradise",
    icon: Sparkles,
    highlight: "center",
    position: "center",
    content: [
      "Experience anime-inspired gambling games",
      "Win SOL and unlock exclusive items",
      "Chat with players from around the world",
      "Climb leaderboards and earn achievements"
    ]
  },
  {
    id: "games",
    title: "Game Lobby",
    description: "Choose from our exciting collection of games",
    icon: Gamepad2,
    highlight: "games-section",
    position: "top-left",
    content: [
      "Moon Flip: Classic coin flip with lunar theme",
      "Snake & Ladder: Race to position 100",
      "More games coming soon!",
      "Each game has different minimum bets"
    ]
  },
  {
    id: "chat",
    title: "Community Chat",
    description: "Connect with fellow gamblers",
    icon: MessageCircle,
    highlight: "chat-section",
    position: "bottom-right",
    content: [
      "Chat with players in real-time",
      "Share your big wins and losses",
      "Get tips from experienced players",
      "Respectful communication is required"
    ]
  },
  {
    id: "leaderboard",
    title: "Leaderboards",
    description: "Track your progress and compete with others",
    icon: Trophy,
    highlight: "leaderboard-section",
    position: "top-right",
    content: [
      "Three leaderboard categories available",
      "Wins: Total number of games won",
      "Streaks: Longest winning streaks",
      "Volume: Total SOL wagered"
    ]
  },
  {
    id: "balance",
    title: "Your Balance",
    description: "Monitor your SOL and manage your funds",
    icon: Coins,
    highlight: "balance-section",
    position: "top-right",
    content: [
      "View your current SOL balance",
      "Funds come directly from your wallet",
      "Winnings are added automatically",
      "Only winners pay the small platform fee"
    ]
  },
  {
    id: "shop",
    title: "Nightfall Shop",
    description: "Unlock cosmetics and show off your style",
    icon: ShoppingBag,
    highlight: "shop-button",
    position: "top-right",
    content: [
      "Unlock items by achieving milestones",
      "Purchase premium items with SOL",
      "Titles, borders, sounds, and effects",
      "Express your unique casino personality"
    ]
  },
  {
    id: "settings",
    title: "Settings Panel",
    description: "Customize your casino experience",
    icon: Settings,
    highlight: "settings-button",
    position: "top-right",
    content: [
      "Adjust sound and visual preferences",
      "Configure privacy and chat settings",
      "Set wager warnings for safety",
      "Manage your account details"
    ]
  }
];

export function WelcomeTour({ isOpen, onComplete, username }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  const currentTourStep = tourSteps[currentStep];

  const getModalPosition = () => {
    switch (currentTourStep.position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with spotlight effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Highlight overlay */}
          {currentTourStep.highlight !== "center" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 pointer-events-none z-50"
            >
              {/* This would highlight specific elements - implementation depends on actual layout */}
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/70" />
            </motion.div>
          )}
          
          {/* Tour Modal */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed w-96 max-w-[90vw] z-50",
              getModalPosition()
            )}
          >
            <Card className="bg-gradient-to-br from-[var(--card)] to-[var(--background)] border border-[var(--border)] shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] rounded-lg">
                      <currentTourStep.icon className="w-5 h-5 text-[var(--primary-foreground)]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {currentTourStep.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {currentTourStep.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Welcome message for first step */}
                {currentStep === 0 && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--neon-cyan)]/10 border border-[var(--primary)]/20 rounded-lg">
                    <p className="text-sm text-[var(--primary)]">
                      Welcome <span className="font-semibold">{username}</span>! Ready to explore the neon-lit world of Nightfall Casino?
                    </p>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3 mb-6">
                  {currentTourStep.content.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-[var(--muted-foreground)] leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Progress indicators */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        currentStep === index ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
                      )}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {currentStep + 1} of {tourSteps.length}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevStep}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        Back
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] text-[var(--primary-foreground)] flex items-center gap-1"
                    >
                      {currentStep === tourSteps.length - 1 ? (
                        <>
                          <Star className="w-3 h-3" />
                          Start Playing!
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Skip option */}
                <div className="mt-4 text-center">
                  <button
                    onClick={skipTour}
                    className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Skip tour
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}