import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { WS_BASE_URL } from "../utils/constants";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const listenersRef = useRef(new Map());

  // ─── Subscribe to messages for a specific conversation ─
  const addMessageListener = useCallback((key, callback) => {
    listenersRef.current.set(key, callback);
    return () => listenersRef.current.delete(key);
  }, []);

  // ─── Send a message via WebSocket ──────────────────────
  const sendMessage = useCallback((receiverId, content) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          receiver_id: receiverId,
          content,
        })
      );
    }
  }, []);

  // ─── Connect / Reconnect logic ─────────────────────────
  const connect = useCallback(() => {
    if (!token || !isAuthenticated) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_BASE_URL}/ws/chat?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
          // Notify all listeners
          listenersRef.current.forEach((callback) => callback(data));
        } else if (data.type === "status") {
          setOnlineUsers((prev) => {
            const updated = new Set(prev);
            if (data.is_online) {
              updated.add(data.user_id);
            } else {
              updated.delete(data.user_id);
            }
            return updated;
          });
        }
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error.message);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code);
      setIsConnected(false);

      // Reconnect after 3 seconds (only if we're still authenticated)
      if (token && isAuthenticated) {
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting WebSocket reconnect...");
          connect();
        }, 3000);
      }
    };

    wsRef.current = ws;
  }, [token, isAuthenticated]);

  // ─── Auto-connect when authenticated ───────────────────
  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAuthenticated, token, connect]);

  const value = {
    isConnected,
    onlineUsers,
    sendMessage,
    addMessageListener,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
