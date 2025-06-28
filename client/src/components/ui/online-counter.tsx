import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Wifi } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OnlineCounterProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  variant?: "default" | "minimal" | "detailed";
}

export function OnlineCounter({ 
  className = "", 
  size = "md", 
  showIcon = true, 
  variant = "default" 
}: OnlineCounterProps) {
  const [previousCount, setPreviousCount] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);

  const { data: onlineData, isLoading } = useQuery({
    queryKey: ["/api/users/online/count"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const onlineCount = (onlineData as any)?.count || 0;

  useEffect(() => {
    if (onlineCount !== previousCount) {
      setIsIncreasing(onlineCount > previousCount);
      setPreviousCount(onlineCount);
    }
  }, [onlineCount, previousCount]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs gap-1";
      case "lg":
        return "text-lg gap-3";
      default:
        return "text-sm gap-2";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center animate-pulse", getSizeClasses(), className)}>
        {showIcon && <Users className={cn(getIconSize(), "text-[var(--muted-foreground)]")} />}
        <div className="w-8 h-4 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={cn("flex items-center", getSizeClasses(), className)}
        animate={isIncreasing ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className={cn(
            "font-semibold",
            isIncreasing ? "text-green-400" : onlineCount === 0 ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]"
          )}
          key={onlineCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {onlineCount}
        </motion.span>
      </motion.div>
    );
  }

  if (variant === "detailed") {
    return (
      <motion.div
        className={cn(
          "flex items-center gap-3 p-3 bg-[var(--card)]/50 border border-[var(--border)] rounded-lg backdrop-blur-sm",
          className
        )}
        animate={isIncreasing ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <Users className={cn(getIconSize(), "text-[var(--primary)]")} />
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <motion.span
              className="font-semibold text-[var(--foreground)]"
              key={onlineCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {onlineCount}
            </motion.span>
            {isIncreasing && onlineCount > previousCount && (
              <motion.span
                className="text-xs text-green-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                +{onlineCount - previousCount}
              </motion.span>
            )}
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            {onlineCount === 1 ? "player online" : "players online"}
          </p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      className={cn("flex items-center", getSizeClasses(), className)}
      animate={isIncreasing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {showIcon && (
        <div className="relative">
          <Users className={cn(getIconSize(), "text-[var(--primary)]")} />
          {onlineCount > 0 && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      )}
      
      <motion.span
        className={cn(
          "font-medium",
          isIncreasing ? "text-green-400" : onlineCount === 0 ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]"
        )}
        key={onlineCount}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {onlineCount}
      </motion.span>
      
      <span className="text-[var(--muted-foreground)]">
        {onlineCount === 1 ? "online" : "online"}
      </span>

      {/* Real-time indicator */}
      <motion.div
        className="flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Wifi className="w-2 h-2 text-green-400" />
        <motion.div
          className="w-1 h-1 bg-green-400 rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}

// Badge variant for header/navbar
export function OnlineBadge({ className = "" }: { className?: string }) {
  const { data: onlineData } = useQuery({
    queryKey: ["/api/users/online/count"],
    refetchInterval: 10000,
  });

  const onlineCount = (onlineData as any)?.count || 0;

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1",
        className
      )}
    >
      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
      <Users className="w-3 h-3" />
      {onlineCount}
    </Badge>
  );
}

// Floating widget variant
export function OnlineWidget({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={cn(
        "fixed bottom-4 left-4 z-40",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <OnlineCounter variant="detailed" size="sm" />
    </motion.div>
  );
}