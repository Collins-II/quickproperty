import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import chat from './chat';
import { connectToDatabase } from './database';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

connectToDatabase();
chat(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
