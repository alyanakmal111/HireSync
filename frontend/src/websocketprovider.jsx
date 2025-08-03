// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
  const addUser = (userData) => {
    if (socket) {
      socket.emit("add-user", userData);
    } else {
      console.error("WebSocket connection not established.");
    }
  };
  return (
    <WebSocketContext.Provider value={{ socket, addUser }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
