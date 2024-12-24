import { useState, useEffect, useRef } from "react";

export function useWebSocketLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      console.error("WebSocket URL is not defined.");
      return;
    }

    console.log("Attempting WebSocket connection to:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    ws.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
      attemptReconnect();
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed. Reconnecting...");
      attemptReconnect();
    };
  };

  const attemptReconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setTimeout(() => {
      console.log("Reconnecting to WebSocket...");
      connectWebSocket();
    }, 2000); // Wait 2 seconds before reconnect
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        console.log("WebSocket connection closed.");
      }
    };
  }, []);

  return logs;
}