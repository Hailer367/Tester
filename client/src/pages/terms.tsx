import { motion } from "framer-motion";
import { FileText, ArrowLeft, AlertTriangle, Users, DollarSign, Shield, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

export default function TermsOfService() {
  const sections = [
    {
      id: "eligibility",
      title: "Eligibility Requirements",
      icon: Users,
      content: [
        "Age Requirement: You must be at least 18 years old to use this platform",
        "Legal Capacity: You must have the legal capacity to enter into binding agreements",
        "Jurisdiction: You must not be located in a jurisdiction where online gambling is prohibited",
        "Responsible Gaming: You acknowledge that gambling involves risk and should only wager what you can afford to lose",
        "Account Responsibility: You are responsible for maintaining the security of your wallet and account"
      ]
    },
    {
      id: "game-terms",
      title: "Game Terms & Risk Disclosure",
      icon: DollarSign,
      content: [
        "Risk Warning: All games involve financial risk - never wager SOL you cannot afford to lose",
        "Fee Structure: Playing fees of 0.0001 SOL are deducted only after winning, plus automatic gas fee estimation",
        "Direct Payments: Winnings are paid directly from losing players' staked amounts, not from the platform",
        "Final Outcomes: All game results are final and cannot be reversed or disputed",
        "No Refunds: There are no refunds for any transactions, bets, or purchases made on the platform"
      ]
    },
    {
      id: "admin-rights",
      title: "Platform Administration",
      icon: Shield,
      content: [
        "User Moderation: Administrators reserve the right to ban, mute, or restrict users who violate community standards",
        "Fee Adjustments: Playing fees and game settings may be modified at any time with reasonable notice",
        "Game Control: Administrators can temporarily disable games for maintenance or other operational reasons",
        "Shop Management: Cosmetic items, shop systems, and virtual goods are controlled by platform administrators",
        "Content Moderation: We reserve the right to moderate, remove, or restrict any user-generated content"
      ]
    },
    {
      id: "community-guidelines",
      title: "Community Guidelines",
      icon: Users,
      content: [
        "Respectful Communication: Maintain respectful discourse in all chat and multiplayer interactions",
        "No Harassment: Harassment, threats, or abusive behavior toward other users is strictly prohibited",
        "Fair Play: Any attempt to cheat, exploit, or manipulate games will result in immediate account suspension",
        "Appropriate Content: Do not share inappropriate, offensive, or illegal content in chat or usernames",
        "Spam Prevention: Excessive messaging, advertising, or spam behavior is not permitted"
      ]
    },
    {
      id: "technical-terms",
      title: "Technical & Transaction Terms",
      icon: Gavel,
      content: [
        "Blockchain Finality: All Solana blockchain transactions are final and cannot be reversed by the platform",
        "Network Fees: Users are responsible for all blockchain transaction fees (gas fees) in addition to playing fees",
        "Service Availability: The platform may experience downtime for maintenance, updates, or technical issues",
        "Wallet Security: You are solely responsible for the security of your connected wallet and private keys",
        "Transaction Accuracy: Always verify transaction details before confirming any wallet signatures"
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
            className="absolute w-1 h-1 bg-[var(--gold)] rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 1920],
              y: [0, Math.random() * 1080],
            }}
            transition={{
              duration: Math.random() * 25 + 15,
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
            <div className="p-3 bg-gradient-to-r from-[var(--gold)] to-amber-500 rounded-lg">
              <FileText className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Terms of Service</h1>
              <p className="text-[var(--muted-foreground)] text-lg">
                Rules, regulations, and guidelines for using Nightfall Casino
              </p>
            </div>
          </div>

          <Alert className="border-amber-500/30 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-200">
              <strong>Important:</strong> By using this platform, you agree to these terms. Please read carefully before participating in any games or transactions.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Risk Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Gambling Risk Warning</h3>
                  <p className="text-red-200 leading-relaxed">
                    Gambling involves significant financial risk. Only wager cryptocurrency that you can afford to lose completely. 
                    All games are games of chance, and there is no guarantee of winning. Please gamble responsibly and seek help 
                    if gambling becomes a problem for you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                transition={{ delay: (index + 1) * 0.15 }}
              >
                <Card className="bg-[var(--card)]/80 backdrop-blur-sm border-[var(--border)] hover:border-[var(--gold)]/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-[var(--foreground)]">
                      <div className="p-2 bg-gradient-to-r from-[var(--gold)]/20 to-amber-500/20 rounded-lg">
                        <Icon className="w-5 h-5 text-[var(--gold)]" />
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
                          transition={{ delay: ((index + 1) * 0.15) + (itemIndex * 0.05) }}
                          className="flex items-start gap-3 text-[var(--muted-foreground)]"
                        >
                          <div className="w-2 h-2 bg-[var(--gold)] rounded-full mt-2 flex-shrink-0" />
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

        {/* Agreement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-[var(--gold)]/10 to-amber-500/10 border border-[var(--gold)]/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Agreement & Acceptance</h3>
              <div className="space-y-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
                <p>
                  By creating an account, connecting a wallet, or participating in any games on Nightfall Casino, 
                  you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <p>
                  These terms may be updated from time to time. Continued use of the platform after changes 
                  constitutes acceptance of the updated terms.
                </p>
                <p>
                  If you do not agree with any part of these terms, you must immediately stop using the platform 
                  and disconnect your wallet.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center"
        >
          <div className="mb-4 text-sm text-[var(--muted-foreground)]">
            Last Updated: June 28, 2025
          </div>
          <Link href="/privacy">
            <Button variant="outline" className="mr-4">
              View Privacy Policy
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black">
              Accept & Continue to Casino
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}