"use client"
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import axios from 'axios';
import socket from '../lib/socket.io';
import { ConversationType, CreateUserParams } from '../types';
import { IConversation } from '../lib/database/models/conversation.model';
import { IUser } from '../lib/database/models/user.model';
import { IListing } from '../lib/database/models/listing.model';

interface Message {
    sender: string;
    content: string;
    timestamp: Date;
}

interface ChatBoxProps {
    conversation: IConversation & {
        users: IUser[],
        listing: IListing
    }
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [selectedConversation, setSelectedConversation] = useState<ChatBoxProps>();

    useEffect(() => {
        if (selectedConversation) {
            // Fetch messages from the database
            axios.get(`/api/messages`)
                .then(response => {
                    setMessages(response.data);
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
        }

        socket.on('receiveMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [selectedConversation]);

    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage: Message = { sender: 'Client', content: message, timestamp: new Date() };

            try {
                // Send message to the server
                await axios.post(`/api/messages`, newMessage);

                // Emit the message to other clients via socket
                socket.emit('sendMessage', selectedConversation?.conversation._id, 'Client', message);

                // Update the message list in the UI
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full border rounded-lg">
            <Sidebar selectConversation={setSelectedConversation} />
            {selectedConversation && <ChatBox conversation={selectedConversation.conversation} />}
        </div>
    );
};

export default Chat;
