import { Server, Socket } from 'socket.io';
import Conversation from './database/models/conversation.model';


const chat = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected');

        socket.on('openConversation', async ({ sender, receiver }) => {
            let conversation = await Conversation.findOne({ sender, receiver });

            if (!conversation) {
                conversation = new Conversation({ sender, receiver, messages: [] });
                await conversation.save();
            }

            socket.join(conversation.id);
            socket.emit('conversationOpened', conversation);
        });

        socket.on('sendMessage', async ({ conversationId, sender, content }) => {
            const conversation = await Conversation.findById(conversationId);

            if (conversation) {
                const message = { sender, content, timestamp: new Date() };
                conversation.messages.push(message);
                await conversation.save();
                io.to(conversationId).emit('receiveMessage', message);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

export default chat;
