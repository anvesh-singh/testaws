import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { socketHandler } from './SocketHandler';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/room', roomRoutes);

socketHandler(io);

server.listen(5001, () => {
  console.log(`Server running on http://localhost:5001}`);
});
