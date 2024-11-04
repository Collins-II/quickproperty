// server.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server);

    io.on('connection', (socket: any) => {
        console.log('A user connected:', socket.id);

        socket.on('message', (message: any) => {
            console.log('Message received:', message);
            io.emit('message', message); // Broadcast the message to all clients
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
