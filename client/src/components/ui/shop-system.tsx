import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Star, 
  Crown, 
  Zap, 
  Sparkles, 
  Filter,
  Search,
  X,
  Check,
  Lock,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShopItem {
  id: string;
  name: string;
  category: "titles" | "borders" | "sounds" | "effects" | "coins" | "backgrounds" | "achievements";
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "celestial";
  price?: number; // SOL price, undefined if unlockable only
  unlockCondition?: string;
  isUnlocked: boolean;
  isOwned: boolean;
  isPurchasable: boolean;
  previewUrl?: string;
}

interface ShopSystemProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onPurchase: (item: ShopItem) => Promise<void>;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600", 
  epic: "from-purple-400 to-purple-600",
  legendary: "from-orange-400 to-orange-600",
  celestial: "from-pink-400 via-purple-500 to-cyan-500"
};

const rarityBorders = {
  common: "border-gray-400/30",
  rare: "border-blue-400/30",
  epic: "border-purple-400/30", 
  legendary: "border-orange-400/30",
  celestial: "border-pink-400/30"
};

// All shop items as specified
const shopItems: ShopItem[] = [
  // USER TITLES
  {
    id: "moonlit-drifter",
    name: "Moonlit Drifter",
    category: "titles",
    description: "Win 5 games in a row",
    rarity: "common",
    unlockCondition: "Win 5 games in a row",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "fallen-star",
    name: "Fallen Star", 
    category: "titles",
    description: "Lose 5 games in a row",
    rarity: "common",
    unlockCondition: "Lose 5 games in a row",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "night-blazer",
    name: "Night Blazer",
    category: "titles", 
    description: "Wager a total of 5 SOL",
    rarity: "rare",
    unlockCondition: "Wager a total of 5 SOL",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "twilight-gambler",
    name: "Twilight Gambler",
    category: "titles",
    description: "Play 50 games total",
    rarity: "common", 
    unlockCondition: "Play 50 games total",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "eternal-gambler",
    name: "Eternal Gambler",
    category: "titles",
    description: "Play 100 games without skipping a day for a week",
    rarity: "legendary",
    unlockCondition: "Play 100 games without skipping a day for a week",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },

  // PROFILE BORDERS
  {
    id: "neon-pulse",
    name: "Neon Pulse",
    category: "borders",
    description: "Win 10 games total",
    rarity: "common",
    unlockCondition: "Win 10 games total",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "sapphire-crown",
    name: "Sapphire Crown",
    category: "borders",
    description: "Premium animated border with crystal effects",
    rarity: "rare",
    price: 0.01,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  },
  {
    id: "void-circuit",
    name: "Void Circuit",
    category: "borders",
    description: "Dark tech border with neon circuits",
    rarity: "epic",
    price: 0.02,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  },

  // SOUND PACKS
  {
    id: "city-whispers",
    name: "City Whispers",
    category: "sounds",
    description: "Default ambient city sounds",
    rarity: "common",
    isUnlocked: true,
    isOwned: true,
    isPurchasable: false
  },
  {
    id: "dream-synth",
    name: "Dream Synth",
    category: "sounds", 
    description: "Ethereal synthwave ambient pack",
    rarity: "common",
    price: 0.005,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  },
  {
    id: "bass-of-the-void",
    name: "Bass of the Void",
    category: "sounds",
    description: "Deep bass ambient with void echoes",
    rarity: "epic",
    price: 0.5,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  },
  {
    id: "nebula-sky",
    name: "Nebula Sky",
    category: "sounds",
    description: "Equip 4 Legendary items",
    rarity: "celestial",
    unlockCondition: "Equip 4 Legendary items",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },

  // AVATAR EFFECTS
  {
    id: "soft-sparkle",
    name: "Soft Sparkle",
    category: "effects",
    description: "Win 3 in a row",
    rarity: "common",
    unlockCondition: "Win 3 in a row",
    isUnlocked: false,
    isOwned: false,
    isPurchasable: false
  },
  {
    id: "star-pulse",
    name: "Star Pulse",
    category: "effects",
    description: "Pulsing star effect around avatar",
    rarity: "common",
    price: 0.008,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  },
  {
    id: "moon-burst",
    name: "Moon Burst",
    category: "effects",
    description: "Lunar energy bursts around avatar",
    rarity: "rare",
    price: 0.015,
    isUnlocked: false,
    isOwned: false,
    isPurchasable: true
  }
];

export function ShopSystem({ isOpen, onClose, userBalance, onPurchase }: ShopSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [filteredItems, setFilteredItems] = useState(shopItems);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = shopItems;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedRarity !== "all") {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, selectedRarity, searchTerm]);

  const handlePurchase = async (item: ShopItem) => {
    try {
      await onPurchase(item);
      setSelectedItem(null);
      toast({
        title: "Purchase Successful!",
        description: `You now own ${item.name}`,
      });
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { id: "all", label: "All Items", icon: ShoppingBag },
    { id: "titles", label: "Titles", icon: Crown },
    { id: "borders", label: "Borders", icon: Sparkles },
    { id: "sounds", label: "Sounds", icon: Star },
    { id: "effects", label: "Effects", icon: Zap },
    { id: "coins", label: "Coins", icon: Coins },
    { id: "backgrounds", label: "Backgrounds", icon: Star },
  ];

  const rarities = [
    { id: "all", label: "All Rarities" },
    { id: "common", label: "Common" },
    { id: "rare", label: "Rare" },
    { id: "epic", label: "Epic" },
    { id: "legendary", label: "Legendary" },
    { id: "celestial", label: "Celestial" },
  ];

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
          
          {/* Shop Panel */}
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
                    <ShoppingBag className="w-6 h-6 text-[var(--primary-foreground)]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)]">Nightfall Shop</h2>
                    <p className="text-[var(--muted-foreground)]">
                      Balance: {userBalance.toFixed(4)} SOL
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

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-[var(--background)] border-[var(--border)]"
                    />
                  </div>
                </div>
                
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="bg-[var(--muted)]/50">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className="text-xs"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {category.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>

                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm"
                >
                  {rarities.map((rarity) => (
                    <option key={rarity.id} value={rarity.id}>
                      {rarity.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300",
                      rarityBorders[item.rarity],
                      "bg-gradient-to-br from-[var(--card)]/50 to-[var(--background)]/50 backdrop-blur-sm",
                      "hover:shadow-lg hover:shadow-[var(--primary)]/10"
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Rarity glow */}
                    <div className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                      `bg-gradient-to-br ${rarityColors[item.rarity]}`
                    )} />

                    <div className="relative p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs px-2 py-1 bg-gradient-to-r text-white border-0",
                            rarityColors[item.rarity]
                          )}
                        >
                          {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                        </Badge>
                        
                        {item.isOwned && (
                          <div className="p-1 bg-green-500/20 rounded-full">
                            <Check className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                        {item.name}
                      </h3>
                      
                      <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        {item.isPurchasable ? (
                          <div className="flex items-center gap-1">
                            <Coins className="w-3 h-3 text-[var(--primary)]" />
                            <span className="text-sm font-medium text-[var(--primary)]">
                              {item.price} SOL
                            </span>
                          </div>
                        ) : item.unlockCondition ? (
                          <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[var(--muted-foreground)]" />
                            <span className="text-xs text-[var(--muted-foreground)]">
                              Unlock
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-green-400">Default</span>
                        )}

                        {item.isOwned ? (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Owned
                          </Badge>
                        ) : item.isUnlocked ? (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            Unlocked
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {item.isPurchasable ? "Buy" : "Locked"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-[var(--muted-foreground)] mx-auto mb-4" />
                  <p className="text-[var(--muted-foreground)]">No items found matching your filters</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Item Detail Modal */}
          <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
            <DialogContent className="sm:max-w-md bg-[var(--card)] border-[var(--border)]">
              {selectedItem && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs px-2 py-1 bg-gradient-to-r text-white border-0",
                          rarityColors[selectedItem.rarity]
                        )}
                      >
                        {selectedItem.rarity.charAt(0).toUpperCase() + selectedItem.rarity.slice(1)}
                      </Badge>
                      <DialogTitle className="text-[var(--foreground)]">
                        {selectedItem.name}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-left">
                      {selectedItem.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {selectedItem.unlockCondition && (
                      <div className="p-3 bg-[var(--muted)]/50 rounded-lg">
                        <p className="text-sm text-[var(--muted-foreground)]">
                          <span className="font-medium">Unlock Condition:</span> {selectedItem.unlockCondition}
                        </p>
                      </div>
                    )}

                    {selectedItem.isPurchasable && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--neon-cyan)]/10 rounded-lg border border-[var(--primary)]/20">
                        <span className="text-sm text-[var(--foreground)]">Price:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-[var(--primary)]" />
                          <span className="font-semibold text-[var(--primary)]">
                            {selectedItem.price} SOL
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedItem.isPurchasable && !selectedItem.isOwned && (
                      <Button
                        onClick={() => handlePurchase(selectedItem)}
                        disabled={userBalance < (selectedItem.price || 0)}
                        className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--neon-cyan)] hover:shadow-lg hover:shadow-[var(--primary)]/25"
                      >
                        {userBalance < (selectedItem.price || 0) ? "Insufficient Balance" : "Purchase"}
                      </Button>
                    )}

                    {selectedItem.isOwned && (
                      <Button variant="outline" className="w-full" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        Already Owned
                      </Button>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}