import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatWalletAddress } from "@/lib/wallet-utils";

interface SnakeLadderProps {
  onGameComplete?: (result: { isWin: boolean; amount: string }) => void;
}

interface GameRoom {
  id: number;
  roomName: string;
  hostUser: any;
  maxPlayers: number;
  currentPlayers: number;
  betAmount: string;
  status: string;
  participants: any[];
}

interface GameState {
  currentTurn: number;
  playerPositions: { [key: number]: number };
  gameStatus: string;
  winner?: number;
  lastDiceRoll?: number;
}

export function SnakeLadder({ onGameComplete }: SnakeLadderProps) {
  const { user, solBalance, updateBalance } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("0.001");
  const [roomName, setRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<GameRoom | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  // Fetch available rooms
  const { data: rooms = [], isLoading } = useQuery<GameRoom[]>({
    queryKey: ["/api/games/snake-ladder/rooms"],
    refetchInterval: 2000
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async ({ roomName, betAmount }: { roomName: string; betAmount: string }) => {
      const response = await apiRequest("POST", "/api/games/snake-ladder/create", {
        roomName,
        betAmount
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedRoom(data);
      setShowCreateRoom(false);
      queryClient.invalidateQueries({ queryKey: ["/api/games/snake-ladder/rooms"] });
      toast({
        title: "Room Created",
        description: "Waiting for another player to join...",
        className: "bg-green-600 border-green-500 text-white"
      });
    }
  });

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      const response = await apiRequest("POST", `/api/games/snake-ladder/join/${roomId}`);
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedRoom(data);
      queryClient.invalidateQueries({ queryKey: ["/api/games/snake-ladder/rooms"] });
      toast({
        title: "Room Joined",
        description: "Game starting soon!",
        className: "bg-blue-600 border-blue-500 text-white"
      });
    }
  });

  // Roll dice mutation
  const rollDiceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/games/snake-ladder/roll/${selectedRoom?.id}`);
      return response.json();
    },
    onSuccess: (data) => {
      setLastRoll(data.diceRoll);
      setGameState(data.gameState);
      
      if (data.gameState.gameStatus === "finished") {
        const isWin = data.gameState.winner === user?.id;
        toast({
          title: isWin ? "🎉 Victory!" : "Game Over",
          description: isWin ? `You won ${selectedRoom?.betAmount} SOL!` : "Better luck next time!",
          className: isWin ? "bg-green-600 border-green-500 text-white" : "bg-gray-600 border-gray-500 text-white"
        });
        
        updateBalance();
        onGameComplete?.({ isWin, amount: selectedRoom?.betAmount || "0" });
        
        setTimeout(() => {
          setSelectedRoom(null);
          setGameState(null);
        }, 3000);
      }
    }
  });

  const handleCreateRoom = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to create a room",
        variant: "destructive"
      });
      return;
    }

    if (!roomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please enter a room name",
        variant: "destructive"
      });
      return;
    }

    const bet = parseFloat(betAmount);
    if (bet < 0.001) {
      toast({
        title: "Invalid Bet",
        description: "Minimum bet is 0.001 SOL",
        variant: "destructive"
      });
      return;
    }

    if (bet > solBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough SOL",
        variant: "destructive"
      });
      return;
    }

    createRoomMutation.mutate({ roomName, betAmount });
  };

  const handleJoinRoom = (room: GameRoom) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please connect your wallet to join a room",
        variant: "destructive"
      });
      return;
    }

    const bet = parseFloat(room.betAmount);
    if (bet > solBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough SOL",
        variant: "destructive"
      });
      return;
    }

    joinRoomMutation.mutate(room.id);
  };

  const handleRollDice = () => {
    if (gameState?.currentTurn !== user?.id) {
      toast({
        title: "Not Your Turn",
        description: "Wait for your turn to roll the dice",
        variant: "destructive"
      });
      return;
    }

    setDiceRolling(true);
    setTimeout(() => {
      setDiceRolling(false);
      rollDiceMutation.mutate();
    }, 1000);
  };

  // Generate board cells
  const generateBoard = () => {
    const cells = [];
    for (let i = 100; i >= 1; i--) {
      const row = Math.floor((100 - i) / 10);
      const isEvenRow = row % 2 === 0;
      const cellIndex = isEvenRow ? i : (100 - (i - (row * 10)) + 1 - (row * 10));
      
      // Special cells (snakes and ladders)
      const isSnake = [16, 47, 49, 56, 62, 64, 87, 93, 95, 98].includes(cellIndex);
      const isLadder = [1, 4, 9, 21, 28, 36, 51, 71, 80].includes(cellIndex);
      
      cells.push(
        <div
          key={cellIndex}
          className={`relative w-8 h-8 border border-white/20 flex items-center justify-center text-xs ${
            isSnake ? 'bg-red-600/30' : isLadder ? 'bg-green-600/30' : 'bg-[var(--midnight)]/30'
          }`}
        >
          <span className="text-white/60">{cellIndex}</span>
          
          {/* Player positions */}
          {selectedRoom?.participants.map((participant, idx) => {
            const position = gameState?.playerPositions[participant.userId] || 0;
            if (position === cellIndex) {
              return (
                <div
                  key={participant.userId}
                  className={`absolute w-4 h-4 rounded-full border-2 ${
                    participant.userId === user?.id 
                      ? 'bg-[var(--gold)] border-yellow-300' 
                      : 'bg-blue-500 border-blue-300'
                  }`}
                  style={{ 
                    top: idx === 0 ? '2px' : '18px',
                    left: idx === 0 ? '2px' : '18px'
                  }}
                />
              );
            }
            return null;
          })}
          
          {/* Snake/Ladder indicators */}
          {isSnake && <i className="fas fa-snake text-red-400 absolute top-0 right-0 text-xs"></i>}
          {isLadder && <i className="fas fa-ladder text-green-400 absolute top-0 right-0 text-xs"></i>}
        </div>
      );
    }
    return cells;
  };

  if (selectedRoom && gameState) {
    // Game View
    return (
      <div className="glass-morphism rounded-xl p-6 max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <i className="fas fa-dice text-[var(--gold)] mr-3"></i>
              {selectedRoom.roomName}
            </h2>
            <p className="text-gray-400">Bet: {selectedRoom.betAmount} SOL</p>
          </div>
          
          <div className="text-right">
            <div className="text-[var(--gold)] font-bold">
              {gameState.gameStatus === "finished" ? "Game Finished!" : "Game in Progress"}
            </div>
            <div className="text-sm text-gray-400">
              Turn: {gameState.currentTurn === user?.id ? "Your turn" : "Opponent's turn"}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-10 gap-1 mb-6 p-4 bg-[var(--midnight)]/50 rounded-lg">
          {generateBoard()}
        </div>

        {/* Dice Section */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="text-center">
            <div 
              className={`w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold text-[var(--midnight)] ${
                diceRolling ? 'animate-bounce' : ''
              }`}
            >
              {diceRolling ? "?" : lastRoll || "?"}
            </div>
            <p className="text-sm text-gray-400 mt-2">Last Roll</p>
          </div>
          
          <Button
            onClick={handleRollDice}
            disabled={gameState.currentTurn !== user?.id || diceRolling || gameState.gameStatus === "finished"}
            className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold"
          >
            {diceRolling ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Rolling...
              </>
            ) : (
              <>
                <i className="fas fa-dice mr-2"></i>
                Roll Dice
              </>
            )}
          </Button>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 gap-4">
          {selectedRoom.participants.map((participant, idx) => (
            <div key={participant.userId} className="bg-[var(--midnight)]/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${
                  participant.userId === user?.id ? 'bg-[var(--gold)]' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="text-white font-semibold">
                    {participant.userId === user?.id ? "You" : formatWalletAddress(participant.walletAddress)}
                  </div>
                  <div className="text-sm text-gray-400">
                    Position: {gameState.playerPositions[participant.userId] || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedRoom) {
    // Waiting Room View
    return (
      <div className="glass-morphism rounded-xl p-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Waiting for Players</h2>
        <div className="animate-pulse mb-6">
          <i className="fas fa-hourglass-half text-[var(--gold)] text-4xl"></i>
        </div>
        <p className="text-gray-400 mb-4">Room: {selectedRoom.roomName}</p>
        <p className="text-gray-400 mb-6">
          Players: {selectedRoom.currentPlayers}/{selectedRoom.maxPlayers}
        </p>
        <Button
          onClick={() => setSelectedRoom(null)}
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          Leave Room
        </Button>
      </div>
    );
  }

  // Room List View
  return (
    <div className="glass-morphism rounded-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <i className="fas fa-dice text-[var(--gold)] mr-3"></i>
            Snake & Ladder
          </h2>
          <p className="text-gray-400">Race to reach 100 first!</p>
        </div>
        
        <Button
          onClick={() => setShowCreateRoom(!showCreateRoom)}
          className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] font-bold"
        >
          <i className="fas fa-plus mr-2"></i>
          Create Room
        </Button>
      </div>

      {/* Create Room Section */}
      {showCreateRoom && (
        <div className="bg-[var(--midnight)]/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Create New Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-white mb-2 block">Room Name</Label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Bet Amount (SOL)</Label>
              <Input
                type="number"
                step="0.001"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {createRoomMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Create Room
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowCreateRoom(false)}
              variant="ghost"
              className="text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Available Rooms */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Available Rooms</h3>
        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-[var(--gold)] text-2xl"></i>
            <p className="text-gray-400 mt-2">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-home text-gray-500 text-3xl mb-4"></i>
            <p className="text-gray-400">No rooms available. Create one to start playing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-[var(--midnight)]/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{room.roomName}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    room.status === "waiting" ? "bg-orange-600 text-white" : "bg-green-600 text-white"
                  }`}>
                    {room.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Host:</span>
                    <span>{formatWalletAddress(room.hostUser.walletAddress)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bet Amount:</span>
                    <span className="text-[var(--gold)]">{room.betAmount} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Players:</span>
                    <span>{room.currentPlayers}/{room.maxPlayers}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleJoinRoom(room)}
                  disabled={room.currentPlayers >= room.maxPlayers || joinRoomMutation.isPending}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {joinRoomMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Joining...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Join Room
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}