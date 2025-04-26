"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const SocketHandler_1 = require("./SocketHandler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/room', roomRoutes);
(0, SocketHandler_1.socketHandler)(io);
server.listen(5001, () => {
    console.log(`Server running on http://localhost:5001}`);
});
