import { motion } from "framer-motion";

interface WebsiteIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function WebsiteIcon({ size = 32, className = "", animated = false }: WebsiteIconProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={animated ? {
        rotate: [0, 360],
      } : {}}
      transition={animated ? {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      } : {}}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle with night gradient */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="url(#nightGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="2"
        />
        
        {/* Moon (top left) */}
        <motion.circle
          cx="22"
          cy="18"
          r="6"
          fill="url(#moonGradient)"
          animate={animated ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={animated ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        
        {/* Moon craters */}
        <circle cx="20" cy="16" r="1" fill="rgba(0,0,0,0.2)" />
        <circle cx="24" cy="19" r="0.5" fill="rgba(0,0,0,0.2)" />
        
        {/* Casino dice (center) */}
        <motion.g
          animate={animated ? {
            rotateZ: [0, 360],
          } : {}}
          transition={animated ? {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          } : {}}
          style={{ transformOrigin: "32px 32px" }}
        >
          <rect
            x="26"
            y="26"
            width="12"
            height="12"
            rx="2"
            fill="url(#diceGradient)"
            stroke="#FFD700"
            strokeWidth="0.5"
          />
          
          {/* Dice dots */}
          <circle cx="29" cy="29" r="1" fill="#000" />
          <circle cx="35" cy="35" r="1" fill="#000" />
          <circle cx="29" cy="35" r="1" fill="#000" />
          <circle cx="35" cy="29" r="1" fill="#000" />
          <circle cx="32" cy="32" r="1" fill="#000" />
        </motion.g>
        
        {/* Sparkle stars */}
        <motion.g
          animate={animated ? {
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          } : {}}
          transition={animated ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          } : {}}
        >
          <path
            d="M45 20 L46 18 L47 20 L49 19 L47 22 L45 20 Z"
            fill="#00FFFF"
          />
          <path
            d="M50 40 L51 38 L52 40 L54 39 L52 42 L50 40 Z"
            fill="#FFD700"
          />
          <path
            d="M15 45 L16 43 L17 45 L19 44 L17 47 L15 45 Z"
            fill="#00FFFF"
          />
        </motion.g>
        
        {/* City skyline silhouette (bottom) */}
        <path
          d="M4 50 L8 45 L12 48 L16 44 L20 47 L24 43 L28 46 L32 42 L36 45 L40 41 L44 44 L48 40 L52 43 L56 39 L60 42 L60 58 L4 58 Z"
          fill="rgba(0,0,0,0.4)"
        />
        
        {/* Neon glow effect */}
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Gradients */}
        <defs>
          <radialGradient id="nightGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#2D1B69" />
            <stop offset="50%" stopColor="#1A0B3D" />
            <stop offset="100%" stopColor="#0A051A" />
          </radialGradient>
          
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          
          <radialGradient id="moonGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="70%" stopColor="#F0E68C" />
            <stop offset="100%" stopColor="#DAA520" />
          </radialGradient>
          
          <linearGradient id="diceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0E0E0" />
          </linearGradient>
          
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Favicon component for HTML head
export function FaviconSVG() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="#1A0B3D" stroke="#FFD700" strokeWidth="2" />
      <circle cx="22" cy="18" r="6" fill="#F0E68C" />
      <circle cx="20" cy="16" r="1" fill="rgba(0,0,0,0.2)" />
      <circle cx="24" cy="19" r="0.5" fill="rgba(0,0,0,0.2)" />
      <rect x="26" y="26" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#FFD700" strokeWidth="0.5" />
      <circle cx="29" cy="29" r="1" fill="#000" />
      <circle cx="35" cy="35" r="1" fill="#000" />
      <circle cx="29" cy="35" r="1" fill="#000" />
      <circle cx="35" cy="29" r="1" fill="#000" />
      <circle cx="32" cy="32" r="1" fill="#000" />
      <path d="M45 20 L46 18 L47 20 L49 19 L47 22 L45 20 Z" fill="#00FFFF" />
      <path d="M50 40 L51 38 L52 40 L54 39 L52 42 L50 40 Z" fill="#FFD700" />
      <path d="M15 45 L16 43 L17 45 L19 44 L17 47 L15 45 Z" fill="#00FFFF" />
      <path d="M4 50 L8 45 L12 48 L16 44 L20 47 L24 43 L28 46 L32 42 L36 45 L40 41 L44 44 L48 40 L52 43 L56 39 L60 42 L60 58 L4 58 Z" fill="rgba(0,0,0,0.4)" />
    </svg>
  );
}