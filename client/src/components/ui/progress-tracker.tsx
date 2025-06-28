import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Star, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked?: boolean;
  category: "achievement" | "milestone" | "quest";
  reward?: {
    type: "title" | "border" | "effect" | "sol";
    value: string;
  };
}

interface ProgressTrackerProps {
  items: ProgressItem[];
  onItemComplete?: (itemId: string) => void;
  className?: string;
}

export function ProgressTracker({ items, onItemComplete, className }: ProgressTrackerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categoryIcons = {
    achievement: Trophy,
    milestone: Target,
    quest: Star,
  };

  const categoryColors = {
    achievement: "from-[var(--gold)] to-amber-400",
    milestone: "from-[var(--neon-cyan)] to-cyan-400",
    quest: "from-purple-400 to-purple-600",
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => {
        const Icon = categoryIcons[item.category];
        const isExpanded = expandedItem === item.id;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all duration-300",
              item.completed 
                ? "bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30" 
                : item.locked
                ? "bg-gradient-to-r from-gray-900/20 to-slate-900/20 border-gray-600/30 opacity-60"
                : "bg-gradient-to-r from-[var(--card)]/80 to-[var(--muted)]/40 border-[var(--border)] hover:border-[var(--primary)]/30"
            )}
          >
            {/* Animated background glow */}
            {!item.locked && (
              <motion.div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300",
                  item.completed 
                    ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10" 
                    : "bg-gradient-to-r from-[var(--primary)]/5 to-[var(--neon-cyan)]/5"
                )}
                animate={{ opacity: isExpanded ? 1 : 0 }}
              />
            )}

            <div
              className="relative p-4 cursor-pointer"
              onClick={() => !item.locked && setExpandedItem(isExpanded ? null : item.id)}
            >
              <div className="flex items-center gap-4">
                {/* Animated Checkbox */}
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300",
                      item.completed
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400"
                        : item.locked
                        ? "border-gray-500"
                        : "border-[var(--primary)] hover:border-[var(--neon-cyan)]"
                    )}
                    whileHover={!item.locked ? { scale: 1.1 } : {}}
                    whileTap={!item.locked ? { scale: 0.95 } : {}}
                  >
                    <AnimatePresence>
                      {item.completed && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Completion effect */}
                  {item.completed && (
                    <motion.div
                      className="absolute inset-0 rounded border-2 border-green-400"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [1, 0, 0] 
                      }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  )}
                </div>

                {/* Category Icon */}
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-r",
                  categoryColors[item.category]
                )}>
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-medium text-sm",
                      item.completed 
                        ? "text-green-400" 
                        : item.locked
                        ? "text-gray-400"
                        : "text-[var(--foreground)]"
                    )}>
                      {item.title}
                    </h3>
                    {item.reward && (
                      <motion.div
                        className="px-2 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded text-xs text-[var(--primary)]"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.reward.value}
                      </motion.div>
                    )}
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    item.locked ? "text-gray-500" : "text-[var(--muted-foreground)]"
                  )}>
                    {item.description}
                  </p>
                </div>

                {/* Expand indicator */}
                {!item.locked && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </motion.div>
                )}
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && !item.locked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-[var(--border)] mt-4">
                      <div className="text-sm text-[var(--muted-foreground)] mb-3">
                        Progress details and tips will appear here
                      </div>
                      
                      {!item.completed && (
                        <motion.button
                          className="px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/25"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemComplete?.(item.id);
                          }}
                        >
                          Mark Complete
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Demo data for testing
export const demoProgressItems: ProgressItem[] = [
  {
    id: "first-win",
    title: "First Victory",
    description: "Win your first game in any mode",
    completed: true,
    category: "milestone",
    reward: { type: "title", value: "Nightfall Initiate" }
  },
  {
    id: "win-streak-5",
    title: "Moonlit Drifter",
    description: "Win 5 games in a row",
    completed: false,
    category: "achievement",
    reward: { type: "title", value: "Moonlit Drifter" }
  },
  {
    id: "high-roller",
    title: "High Roller",
    description: "Place a bet over 1 SOL",
    completed: false,
    category: "quest",
    reward: { type: "border", value: "Golden Aura" }
  },
  {
    id: "legendary-unlock",
    title: "Eternal Gambler",
    description: "Play 100 games without skipping a day for a week",
    completed: false,
    locked: true,
    category: "achievement",
    reward: { type: "title", value: "Eternal Gambler" }
  }
];