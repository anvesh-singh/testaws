import { Server, Socket } from 'socket.io';

const rooms: Record<string, Set<string>> = {};

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join-room', ({ roomId, userId }) => {
      // ensure room exists
      if (!rooms[roomId]) rooms[roomId] = new Set();

      // 1) tell the new socket who’s already in the room
      const existingUsers = Array.from(rooms[roomId]);
      socket.emit('all-users', existingUsers);

      // 2) add them to the room
      rooms[roomId].add(userId);
      socket.join(roomId);

      // 3) notify everyone else that a new user joined
      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        rooms[roomId]?.delete(userId);
        socket.to(roomId).emit('user-disconnected', userId);
      });

      socket.on('signal', ({ to, from, data }) => {
        io.to(to).emit('signal', { from, data });
      });
    });
  });
};
