import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, X, ChevronLeft, ChevronRight, Coins, Target, Dice1, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GameGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameStep {
  id: string;
  title: string;
  description: string;
  image: string; // SVG or emoji representation
  tips?: string[];
}

interface GameInfo {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  minBet: string;
  maxPlayers: number;
  description: string;
  steps: GameStep[];
}

const gameGuides: GameInfo[] = [
  {
    id: "moon-flip",
    name: "Moon Flip",
    icon: Coins,
    difficulty: "Beginner",
    minBet: "0.01 SOL",
    maxPlayers: 2,
    description: "A classic coin flip game with a lunar twist. Choose Moon or Star and test your luck against another player.",
    steps: [
      {
        id: "step-1",
        title: "Choose Your Side",
        description: "Select either Moon 🌙 or Star ⭐ as your prediction for the coin flip outcome.",
        image: "🌙⭐",
        tips: [
          "Both sides have exactly 50% chance of winning",
          "Choose based on your intuition or lucky feeling",
          "Your choice doesn't affect the actual odds"
        ]
      },
      {
        id: "step-2", 
        title: "Set Your Wager",
        description: "Decide how much SOL you want to bet on this round. Minimum bet is 0.01 SOL.",
        image: "💰",
        tips: [
          "Only bet what you can afford to lose",
          "Higher bets mean higher potential winnings",
          "Consider your wallet balance before betting"
        ]
      },
      {
        id: "step-3",
        title: "Wait for Opponent",
        description: "The system will match you with another player who chose the opposite side.",
        image: "👥",
        tips: [
          "Matching usually takes a few seconds",
          "You can cancel and return to lobby anytime",
          "Both players must have the same bet amount"
        ]
      },
      {
        id: "step-4",
        title: "Coin Flip Animation",
        description: "Watch the cosmic coin flip animation to see the result in real-time.",
        image: "🪙✨",
        tips: [
          "The result is determined by secure randomness",
          "Animation is purely visual - result is pre-determined",
          "Both players see the same animation simultaneously"
        ]
      },
      {
        id: "step-5",
        title: "Claim Your Winnings",
        description: "If you chose correctly, you win the opponent's bet minus the small platform fee.",
        image: "🏆",
        tips: [
          "Winners receive the full opponent bet minus 0.0001 SOL fee",
          "Winnings are automatically added to your balance",
          "Transaction fees are estimated and included"
        ]
      }
    ]
  },
  {
    id: "snake-ladder",
    name: "Snake & Ladder",
    icon: ArrowUp,
    difficulty: "Intermediate", 
    minBet: "0.02 SOL",
    maxPlayers: 4,
    description: "A modern take on the classic board game. Roll dice, climb ladders, avoid snakes, and race to reach position 100 first.",
    steps: [
      {
        id: "step-1",
        title: "Join or Create Room",
        description: "Either join an existing game room or create your own with custom bet amount.",
        image: "🏠",
        tips: [
          "Room creator sets the bet amount for all players",
          "You can see how many players are already in each room",
          "Games start automatically when room is full"
        ]
      },
      {
        id: "step-2",
        title: "Wait for Players",
        description: "Games begin when the room reaches its player limit (2-4 players).",
        image: "⏳",
        tips: [
          "More players mean bigger potential winnings",
          "You can chat with other players while waiting",
          "Host can start game early if desired"
        ]
      },
      {
        id: "step-3",
        title: "Roll the Dice",
        description: "On your turn, click to roll the dice and move your piece forward by the rolled amount.",
        image: "🎲",
        tips: [
          "Dice results are random and fair for all players",
          "You move automatically after rolling",
          "Turn order is fixed throughout the game"
        ]
      },
      {
        id: "step-4",
        title: "Navigate Snakes & Ladders",
        description: "Land on ladder bottoms to climb up, but avoid snake heads that will send you down.",
        image: "🐍🪜",
        tips: [
          "Ladders can give you a huge advantage",
          "Snakes near the end are especially dangerous",
          "Plan your moves but remember dice are random"
        ]
      },
      {
        id: "step-5",
        title: "Reach Position 100",
        description: "First player to reach or exceed position 100 wins the entire pot of all player bets.",
        image: "🎯",
        tips: [
          "You need the exact number or higher to win",
          "Winner takes all bets minus platform fee",
          "Games can change dramatically with one roll"
        ]
      }
    ]
  }
];

export function GameGuide({ isOpen, onClose }: GameGuideProps) {
  const [selectedGame, setSelectedGame] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const currentGameGuide = gameGuides[selectedGame];
  const currentStepData = currentGameGuide?.steps[currentStep];

  const nextStep = () => {
    if (currentStep < currentGameGuide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectGame = (gameIndex: number) => {
    setSelectedGame(gameIndex);
    setCurrentStep(0);
  };

  const difficultyColors = {
    Beginner: "from-green-400 to-green-600",
    Intermediate: "from-yellow-400 to-orange-500", 
    Advanced: "from-red-400 to-red-600"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Guide Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 bg-gradient-to-br from-[var(--card)] via-[var(--background)] to-[var(--card)] border border-[var(--border)] rounded-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--card)]/95 backdrop-blur-sm border-b border-[var(--border)] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] rounded-lg">
                    <Book className="w-6 h-6 text-[var(--primary-foreground)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Game Guide</h2>
                    <p className="text-[var(--muted-foreground)]">
                      Learn how to play each game with step-by-step instructions
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Game Selection */}
              <div className="flex gap-4 mt-6">
                {gameGuides.map((game, index) => {
                  const Icon = game.icon;
                  return (
                    <Button
                      key={game.id}
                      variant={selectedGame === index ? "default" : "outline"}
                      onClick={() => selectGame(index)}
                      className={cn(
                        "flex items-center gap-2",
                        selectedGame === index ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : ""
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {game.name}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Game Info Sidebar */}
              <div className="w-80 bg-[var(--muted)]/20 border-r border-[var(--border)] p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Game Overview */}
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {currentGameGuide && <currentGameGuide.icon className="w-5 h-5" />}
                        {currentGameGuide?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "bg-gradient-to-r text-white border-0",
                            difficultyColors[currentGameGuide?.difficulty || "Beginner"]
                          )}
                        >
                          {currentGameGuide?.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[var(--muted-foreground)]">Min Bet:</span>
                          <span className="text-[var(--foreground)]">{currentGameGuide?.minBet}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[var(--muted-foreground)]">Max Players:</span>
                          <span className="text-[var(--foreground)]">{currentGameGuide?.maxPlayers}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                        {currentGameGuide?.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step Navigation */}
                  <Card className="bg-[var(--card)]/50 border-[var(--border)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentGameGuide?.steps.map((step, index) => (
                          <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg transition-colors text-sm",
                              currentStep === index 
                                ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary)]"
                                : "hover:bg-[var(--muted)]/30 text-[var(--muted-foreground)]"
                            )}
                          >
                            <span className="font-medium">Step {index + 1}:</span> {step.title}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {currentStepData && (
                  <motion.div
                    key={`${selectedGame}-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-2xl mx-auto"
                  >
                    {/* Step Header */}
                    <div className="text-center mb-8">
                      <div className="text-6xl mb-4">{currentStepData.image}</div>
                      <h3 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                        {currentStepData.title}
                      </h3>
                      <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
                        {currentStepData.description}
                      </p>
                    </div>

                    {/* Tips */}
                    {currentStepData.tips && (
                      <Card className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--neon-cyan)]/10 border border-[var(--primary)]/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-[var(--primary)]" />
                            Pro Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {currentStepData.tips.map((tip, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]"
                              >
                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                                <span>{tip}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {currentGameGuide?.steps.map((_, index) => (
                          <div
                            key={index}
                            className={cn(
                              "w-2 h-2 rounded-full transition-colors",
                              currentStep === index ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
                            )}
                          />
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={nextStep}
                        disabled={currentStep === currentGameGuide.steps.length - 1}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}