import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { useWebSocket } from "@/hooks/use-websocket";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@shared/schema";

export function ChatSystem() {
  const { user } = useWallet();
  const { sendMessage, messages: liveMessages, onlineCount } = useWebSocket();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat messages
  const { data: initialMessages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    enabled: true
  });

  // Combine initial messages with live messages
  const allMessages = [...initialMessages, ...liveMessages];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !user) return;
    
    sendMessage(messageInput.trim());
    setMessageInput("");
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const getUserGradient = (index: number) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500", 
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-[var(--gold)] to-yellow-400"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="lg:col-span-2 glass-morphism rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <i className="fas fa-comments text-[var(--gold)] mr-3"></i>
          Night Chat
          <span className="ml-2 text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            {onlineCount} online
          </span>
        </h3>
        <button className="text-gray-400 hover:text-white transition-colors duration-300">
          <i className="fas fa-cog"></i>
        </button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="h-64 mb-4 pr-4">
        <div className="space-y-2">
          {allMessages.map((message, index) => (
            <div 
              key={`${message.id}-${index}`} 
              className="p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <div 
                  className={`w-8 h-8 bg-gradient-to-br ${getUserGradient(index)} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {message.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white">{message.username}</span>
                    {/* Add winning streak indicator for active users */}
                    {Math.random() > 0.7 && (
                      <span className="winning-streak text-xs">🔥 Win Streak x{Math.floor(Math.random() * 10) + 1}</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(message.timestamp!)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 break-words">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="flex space-x-3">
        <Input
          type="text"
          placeholder={user ? "Share your thoughts with the night owls..." : "Connect wallet to chat..."}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={!user}
          className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50"
        />
        <Button
          type="submit"
          disabled={!user || !messageInput.trim()}
          className="bg-gradient-to-r from-[var(--gold)] to-yellow-400 text-[var(--midnight)] px-6 font-semibold hover:shadow-lg hover:shadow-[var(--gold)]/50 transition-all duration-300"
        >
          <i className="fas fa-paper-plane"></i>
        </Button>
      </form>

      {/* Chat Features */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>
            <i className="fas fa-users mr-1"></i>
            {onlineCount} online
          </span>
          <span>
            <i className="fas fa-fire mr-1"></i>
            {Math.floor(onlineCount * 0.027)} on streak
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="hover:text-white transition-colors duration-300">
            <i className="fas fa-smile"></i>
          </button>
          <button className="hover:text-white transition-colors duration-300">
            <i className="fas fa-gift"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
