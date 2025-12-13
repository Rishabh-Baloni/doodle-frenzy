'use client'

import { io } from 'socket.io-client';

// Configuration
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Singleton socket instance
let socketInstance = null;

const createSocket = () => {
  return io(SOCKET_URL, {
    path: '/socket.io',
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false, // We'll connect manually
    transports: ['websocket'],
    query: {
      socketId: socketInstance?.id // <--- Update this line
    }
  });
};

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = createSocket();
    
    // Connection logging for debugging
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });
    
    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });
  }
  return socketInstance;
};

// Public API
export const socket = getSocket();
export const connectSocket = () => {
  socket.connect({
    query: {
      socketId: socket.id
    }
  });
};
export const disconnectSocket = () => socket.disconnect();