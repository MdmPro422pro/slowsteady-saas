import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

export interface ChatMessage {
  id: string;
  walletAddress: string;
  username: string;
  content: string;
  room: string;
  createdAt: Date;
}

export interface OnlineUser {
  walletAddress: string;
  username: string;
}

export function useChat(username: string) {
  const { address } = useAccount();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!address || !username) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setError(null);
      
      // Authenticate with wallet and username
      newSocket.emit('authenticate', { walletAddress: address, username });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    newSocket.on('authenticated', ({ rooms }) => {
      console.log('Authenticated successfully', rooms);
      setIsAuthenticated(true);
    });

    newSocket.on('error', ({ message }) => {
      console.error('Socket error:', message);
      setError(message);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [address, username]);

  // Join room
  const joinRoom = useCallback((room: string) => {
    if (!socket || !isAuthenticated) {
      console.warn('Cannot join room: not authenticated');
      return;
    }

    console.log('Joining room:', room);
    socket.emit('join_room', { room });
    setCurrentRoom(room);
    setMessages([]); // Clear messages when switching rooms
  }, [socket, isAuthenticated]);

  // Listen for room events
  useEffect(() => {
    if (!socket) return;

    socket.on('room_joined', ({ room, userCount }) => {
      console.log(`Joined room: ${room} (${userCount} users)`);
    });

    socket.on('message_history', (history: ChatMessage[]) => {
      console.log('Received message history:', history.length);
      setMessages(history);
    });

    socket.on('new_message', (message: ChatMessage) => {
      console.log('New message:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('online_users', (users: OnlineUser[]) => {
      console.log('Online users updated:', users.length);
      setOnlineUsers(users);
    });

    socket.on('user_joined', ({ username: joinedUser }) => {
      console.log(`User joined: ${joinedUser}`);
    });

    socket.on('user_left', ({ username: leftUser }) => {
      console.log(`User left: ${leftUser}`);
    });

    socket.on('user_typing', ({ username: typingUser, isTyping }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(typingUser);
        } else {
          next.delete(typingUser);
        }
        return next;
      });
    });

    return () => {
      socket.off('room_joined');
      socket.off('message_history');
      socket.off('new_message');
      socket.off('online_users');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
    };
  }, [socket]);

  // Send message
  const sendMessage = useCallback((content: string) => {
    if (!socket || !currentRoom || !content.trim()) {
      console.warn('Cannot send message:', { socket: !!socket, currentRoom, content: content.trim() });
      return;
    }

    console.log('Sending message:', content);
    socket.emit('send_message', { content: content.trim(), room: currentRoom });
  }, [socket, currentRoom]);

  // Emit typing indicator
  const emitTyping = useCallback((isTyping: boolean) => {
    if (!socket || !currentRoom) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing', { room: currentRoom, isTyping });

    // Auto-stop typing after 3 seconds
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { room: currentRoom, isTyping: false });
      }, 3000);
    }
  }, [socket, currentRoom]);

  return {
    socket,
    isConnected,
    isAuthenticated,
    currentRoom,
    messages,
    onlineUsers,
    typingUsers: Array.from(typingUsers),
    error,
    joinRoom,
    sendMessage,
    emitTyping,
  };
}
