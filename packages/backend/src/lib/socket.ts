import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import prisma from '../lib/prisma';

interface UserSocket extends Socket {
  walletAddress?: string;
  username?: string;
}

interface OnlineUser {
  walletAddress: string;
  username: string;
  socketId: string;
  room: string;
}

// Track online users
const onlineUsers = new Map<string, OnlineUser>();

// Available chat rooms
export const CHAT_ROOMS = [
  'General',
  'Trading',
  'Tech Support',
  'NFT Hub',
  'DeFi Discussion',
  'Community',
];

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:5173',
        'http://localhost:3000',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: UserSocket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Handle user authentication
    socket.on('authenticate', async ({ walletAddress, username }) => {
      if (!walletAddress || !username) {
        socket.emit('error', { message: 'Wallet address and username required' });
        return;
      }

      // Validate Ethereum address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        socket.emit('error', { message: 'Invalid wallet address format' });
        return;
      }

      socket.walletAddress = walletAddress;
      socket.username = username;

      // Create or update user in database
      try {
        await prisma.user.upsert({
          where: { walletAddress },
          update: {},
          create: {
            walletAddress,
            email: `${walletAddress}@web3.user`, // Placeholder for Web3-only users
            password: '', // No password for Web3 auth
          },
        });

        socket.emit('authenticated', { 
          walletAddress, 
          username,
          rooms: CHAT_ROOMS,
        });
      } catch (error) {
        console.error('Error authenticating user:', error);
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Handle joining a chat room
    socket.on('join_room', async ({ room }) => {
      if (!socket.walletAddress || !socket.username) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!CHAT_ROOMS.includes(room)) {
        socket.emit('error', { message: 'Invalid room' });
        return;
      }

      // Leave previous room if any
      const previousUser = onlineUsers.get(socket.id);
      if (previousUser && previousUser.room !== room) {
        socket.leave(previousUser.room);
        // Notify previous room
        io.to(previousUser.room).emit('user_left', {
          walletAddress: socket.walletAddress,
          username: socket.username,
          room: previousUser.room,
        });
      }

      // Join new room
      socket.join(room);
      onlineUsers.set(socket.id, {
        walletAddress: socket.walletAddress,
        username: socket.username,
        socketId: socket.id,
        room,
      });

      // Load recent messages from database (last 50)
      try {
        const messages = await prisma.message.findMany({
          where: { room },
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            user: {
              select: {
                walletAddress: true,
              },
            },
          },
        });

        // Send messages in chronological order
        socket.emit('message_history', messages.reverse().map(msg => ({
          id: msg.id,
          walletAddress: msg.walletAddress,
          username: msg.username,
          content: msg.content,
          room: msg.room,
          createdAt: msg.createdAt,
        })));

        // Get online users in this room
        const roomUsers = Array.from(onlineUsers.values())
          .filter(u => u.room === room)
          .map(u => ({
            walletAddress: u.walletAddress,
            username: u.username,
          }));

        // Notify room of new user
        io.to(room).emit('user_joined', {
          walletAddress: socket.walletAddress,
          username: socket.username,
          room,
        });

        // Send updated online users list
        io.to(room).emit('online_users', roomUsers);

        socket.emit('room_joined', { room, userCount: roomUsers.length });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle sending messages
    socket.on('send_message', async ({ content, room }) => {
      if (!socket.walletAddress || !socket.username) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!content || !content.trim()) {
        socket.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      if (!CHAT_ROOMS.includes(room)) {
        socket.emit('error', { message: 'Invalid room' });
        return;
      }

      // Limit message length
      const trimmedContent = content.trim().substring(0, 1000);

      try {
        // Save message to database
        const message = await prisma.message.create({
          data: {
            walletAddress: socket.walletAddress,
            username: socket.username,
            content: trimmedContent,
            room,
            user: {
              connectOrCreate: {
                where: { walletAddress: socket.walletAddress },
                create: {
                  walletAddress: socket.walletAddress,
                  email: `${socket.walletAddress}@web3.user`,
                  password: '',
                },
              },
            },
          },
        });

        // Broadcast message to all users in the room
        io.to(room).emit('new_message', {
          id: message.id,
          walletAddress: message.walletAddress,
          username: message.username,
          content: message.content,
          room: message.room,
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ room, isTyping }) => {
      if (!socket.walletAddress || !socket.username) return;
      
      socket.to(room).emit('user_typing', {
        walletAddress: socket.walletAddress,
        username: socket.username,
        isTyping,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      const user = onlineUsers.get(socket.id);
      if (user) {
        // Notify room that user left
        io.to(user.room).emit('user_left', {
          walletAddress: user.walletAddress,
          username: user.username,
          room: user.room,
        });

        // Remove from online users
        onlineUsers.delete(socket.id);

        // Send updated online users list to room
        const roomUsers = Array.from(onlineUsers.values())
          .filter(u => u.room === user.room)
          .map(u => ({
            walletAddress: u.walletAddress,
            username: u.username,
          }));

        io.to(user.room).emit('online_users', roomUsers);
      }
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('WebSocket server initialized');
  return io;
}
