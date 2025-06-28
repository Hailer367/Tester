import { motion } from "framer-motion";
import { Shield, ArrowLeft, Eye, Lock, Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "information-collected",
      title: "Information We Collect",
      icon: Database,
      content: [
        "Wallet Address: Your Solana wallet's public address for authentication and transaction processing",
        "Gameplay Activity: Game results, betting amounts, win/loss records, and game statistics",
        "Shop Usage: Items purchased, unlocked achievements, and inventory status",
        "Chat Logs: Messages sent in public chat rooms for moderation purposes",
        "Session Data: Login times, game duration, and platform usage patterns"
      ]
    },
    {
      id: "how-data-used",
      title: "How Your Data is Used",
      icon: Eye,
      content: [
        "Game Operations: Processing bets, calculating winnings, and maintaining fair gameplay",
        "Leaderboards: Displaying public rankings and achievements based on gameplay performance",
        "Anti-Cheat Systems: Monitoring for suspicious activity and maintaining platform integrity",
        "User Experience: Personalizing interfaces and saving your preferences and settings",
        "Platform Security: Detecting fraud, preventing abuse, and ensuring safe transactions"
      ]
    },
    {
      id: "wallet-interactions",
      title: "Wallet Interactions & Security",
      icon: Lock,
      content: [
        "External Processing: All wallet interactions are handled through Solana-compatible wallets (Phantom, Backpack, Solflare)",
        "Private Key Protection: We never access, store, or request your private keys or seed phrases",
        "Transaction Signing: All transactions require your explicit approval through your connected wallet",
        "Secure Communications: Wallet connections use encrypted protocols to protect your data",
        "No Financial Control: We cannot access your funds without your direct authorization"
      ]
    },
    {
      id: "data-storage",
      title: "Data Storage & Security",
      icon: Shield,
      content: [
        "Secure Backend: All data is stored using enterprise-grade security infrastructure",
        "Encryption: Sensitive data is encrypted both in transit and at rest",
        "Access Controls: Strict access limitations ensure only authorized systems can access your data",
        "Regular Backups: Data is regularly backed up to prevent loss and ensure service continuity",
        "Monitoring: Continuous security monitoring to detect and prevent unauthorized access"
      ]
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: Users,
      content: [
        "Active Accounts: Data is retained while your account remains active and you continue using the platform",
        "Gameplay Records: Game statistics and transaction history are preserved for fairness verification",
        "Chat Logs: Public chat messages may be retained for moderation and community safety purposes",
        "Legal Requirements: Some data may be retained longer to comply with regulatory obligations",
        "Account Deletion: You may request account deletion, though some records may be preserved for legal compliance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--midnight)] via-[var(--deep-purple)] to-[var(--navy)]">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--neon-cyan)] rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 1920],
              y: [0, Math.random() * 1080],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Casino
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] rounded-lg">
              <Shield className="w-8 h-8 text-[var(--primary-foreground)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Privacy Policy</h1>
              <p className="text-[var(--muted-foreground)] text-lg">
                How we collect, use, and protect your information at Nightfall Casino
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Last Updated:</strong> June 28, 2025 | This policy explains our commitment to protecting your privacy while providing a secure gambling experience.
            </p>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[var(--foreground)]">
                      <div className="p-2 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--neon-cyan)]/20 rounded-lg">
                        <Icon className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                          className="flex items-start gap-3 text-[var(--muted-foreground)]"
                        >
                          <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--neon-cyan)]/10 border border-[var(--primary)]/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">Important Notes</h3>
              <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p>• This privacy policy applies specifically to Nightfall Casino platform and services</p>
                <p>• We are committed to transparency and will notify users of any material changes to this policy</p>
                <p>• Your use of the platform constitutes acceptance of these privacy practices</p>
                <p>• For questions about your data or privacy concerns, please use the platform's built-in support features</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <Link href="/terms">
            <Button variant="outline" className="mr-4">
              View Terms of Service
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)]">
              Return to Casino
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}