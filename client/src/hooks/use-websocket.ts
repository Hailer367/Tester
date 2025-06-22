import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";
import type { ChatMessage } from "@shared/schema";

interface WebSocketMessage {
  type: "chat_message" | "user_joined" | "user_left" | "online_count";
  message?: ChatMessage;
  username?: string;
  onlineCount?: number;
}

export function useWebSocket() {
  const { user } = useWallet();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (socket?.readyState === WebSocket.OPEN) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Authenticate if user is logged in
        if (user) {
          newSocket.send(JSON.stringify({
            type: "auth",
            userId: user.id,
            username: user.username
          }));
        }
      };

      newSocket.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case "chat_message":
              if (data.message) {
                setMessages(prev => [...prev, data.message!]);
              }
              break;
            case "user_joined":
            case "user_left":
              if (data.onlineCount !== undefined) {
                setOnlineCount(data.onlineCount);
              }
              break;
            case "online_count":
              if (data.onlineCount !== undefined) {
                setOnlineCount(data.onlineCount);
              }
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.pow(2, reconnectAttempts.current) * 1000;
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [user]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (socket) {
      socket.close();
      setSocket(null);
    }
    
    setIsConnected(false);
    reconnectAttempts.current = 0;
  }, [socket]);

  const sendMessage = useCallback((content: string) => {
    if (socket?.readyState === WebSocket.OPEN && user) {
      socket.send(JSON.stringify({
        type: "chat",
        content
      }));
    }
  }, [socket, user]);

  // Authenticate when user changes
  useEffect(() => {
    if (socket?.readyState === WebSocket.OPEN && user) {
      socket.send(JSON.stringify({
        type: "auth",
        userId: user.id,
        username: user.username
      }));
    }
  }, [socket, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    messages,
    onlineCount
  };
}
