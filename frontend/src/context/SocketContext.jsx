import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Dynamic Socket URL for local & cloud production deployments
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to Realtime Socket Server');
      setIsConnected(true);
      newSocket.emit('join-hospital-room', 'HOSP-001');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket Server');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
