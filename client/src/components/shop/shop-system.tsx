import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/components/wallet/wallet-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  Crown, 
  Frame, 
  Volume2, 
  Sparkles, 
  Coins, 
  Image, 
  Trophy,
  Search,
  Filter,
  Star,
  Lock,
  Check,
  Wallet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ShopItem {
  id: number;
  name: string;
  category: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "celestial";
  priceInSOL: string;
  unlockCondition: string | null;
  isUnlockable: boolean;
  isPurchasable: boolean;
  previewUrl: string | null;
  isHidden: boolean;
  isSeasonal: boolean;
  owned?: boolean;
  equipped?: boolean;
}

const rarityColors = {
  common: "bg-gray-500/20 border-gray-500 text-gray-300",
  rare: "bg-blue-500/20 border-blue-500 text-blue-300", 
  epic: "bg-purple-500/20 border-purple-500 text-purple-300",
  legendary: "bg-orange-500/20 border-orange-500 text-orange-300",
  celestial: "bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500 text-pink-300"
};

const categoryIcons = {
  titles: Crown,
  borders: Frame,
  sounds: Volume2,
  effects: Sparkles,
  coins: Coins,
  backgrounds: Image,
  achievements: Trophy
};

export function ShopSystem() {
  const { user } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch shop items
  const { data: shopItems = [], isLoading } = useQuery<ShopItem[]>({
    queryKey: ["/api/shop/items"],
    enabled: isOpen
  });

  // Fetch user inventory
  const { data: userInventory = [] } = useQuery<any[]>({
    queryKey: ["/api/shop/inventory", user?.id],
    enabled: isOpen && !!user
  });

  // Purchase item mutation
  const purchaseItemMutation = useMutation({
    mutationFn: async ({ itemId, priceSOL }: { itemId: number; priceSOL: string }) => {
      const response = await apiRequest("POST", "/api/shop/purchase", {
        itemId,
        priceSOL
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop/inventory"] });
      toast({
        title: "Purchase Successful!",
        description: "Item has been added to your inventory.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase item.",
        variant: "destructive"
      });
    }
  });

  // Equip item mutation
  const equipItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest("POST", "/api/shop/equip", { itemId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shop/inventory"] });
      toast({
        title: "Item Equipped",
        description: "Item has been equipped successfully.",
        className: "bg-[var(--midnight)] border-[var(--gold)] text-white"
      });
    }
  });

  // Filter items
  const filteredItems = shopItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || item.rarity === selectedRarity;
    const matchesSearch = searchTerm === "" || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRarity && matchesSearch;
  });

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;
    
    // Confirm purchase
    if (!confirm(`Purchase ${item.name} for ${item.priceInSOL} SOL?`)) return;
    
    purchaseItemMutation.mutate({
      itemId: item.id,
      priceSOL: item.priceInSOL
    });
  };

  const getItemStatus = (item: ShopItem) => {
    const inventoryItem = userInventory.find(inv => inv.itemId === item.id);
    if (inventoryItem?.status === "equipped") return "equipped";
    if (inventoryItem) return "owned";
    if (item.isPurchasable) return "purchasable";
    if (item.isUnlockable) return "locked";
    return "unavailable";
  };

  const renderItemCard = (item: ShopItem) => {
    const status = getItemStatus(item);
    const Icon = categoryIcons[item.category as keyof typeof categoryIcons] || ShoppingBag;

    return (
      <Card key={item.id} className={`bg-black/40 border transition-all duration-200 hover:scale-105 ${rarityColors[item.rarity]}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Icon className="w-6 h-6" />
            <Badge variant="outline" className={rarityColors[item.rarity]}>
              {item.rarity}
            </Badge>
          </div>
          <CardTitle className="text-lg">{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">{item.description}</p>
          
          <div className="flex items-center justify-between">
            {status === "equipped" && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500">
                <Check className="w-3 h-3 mr-1" />
                Equipped
              </Badge>
            )}
            {status === "owned" && (
              <Button
                size="sm"
                onClick={() => equipItemMutation.mutate(item.id)}
                disabled={equipItemMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Equip
              </Button>
            )}
            {status === "purchasable" && (
              <Button
                size="sm"
                onClick={() => handlePurchase(item)}
                disabled={purchaseItemMutation.isPending}
                className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/80"
              >
                <Wallet className="w-3 h-3 mr-1" />
                {item.priceInSOL} SOL
              </Button>
            )}
            {status === "locked" && (
              <Badge variant="outline" className="text-gray-500">
                <Lock className="w-3 h-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:text-[var(--gold)] hover:bg-white/10 transition-all duration-200"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Shop
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[var(--midnight)] to-[var(--deep-purple)] border-[var(--gold)] text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[var(--gold)] flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            Nightfall Shop
          </DialogTitle>
        </DialogHeader>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-black/30 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40"
              />
            </div>
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-shrink-0">
            <TabsList className="bg-black/40">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="titles">Titles</TabsTrigger>
              <TabsTrigger value="borders">Borders</TabsTrigger>
              <TabsTrigger value="sounds">Sounds</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="coins">Coins</TabsTrigger>
              <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={selectedRarity} onValueChange={setSelectedRarity} className="flex-shrink-0">
            <TabsList className="bg-black/40">
              <TabsTrigger value="all">All Rarities</TabsTrigger>
              <TabsTrigger value="common">Common</TabsTrigger>
              <TabsTrigger value="rare">Rare</TabsTrigger>
              <TabsTrigger value="epic">Epic</TabsTrigger>
              <TabsTrigger value="legendary">Legendary</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Items Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading shop items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(renderItemCard)}
          </div>
        )}
        
        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No items found matching your filters.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}