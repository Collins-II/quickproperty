"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socket from '../lib/socket.io';
import { useSession } from 'next-auth/react';
import getMessages from '../actions/getMessages';
import { IConversation } from '../lib/database/models/conversation.model';
import ChatHeader from './ChatHeader';
import { IUser } from '../lib/database/models/user.model';
import { IListing } from '../lib/database/models/listing.model';
import { FullMessageType } from '../types';

interface ChatBoxProps {
    conversation: IConversation & {
        users: IUser[],
        listing: IListing
    }
}
const ChatBox = ({ conversation }: ChatBoxProps) => {
    const { data: session } = useSession();
    const userId = session?.user?._id;
    const [messages, setMessages] = useState<FullMessageType[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getMessages(conversation?._id as string);
                setMessages(res.data);
            } catch (err) {
                console.log("MESS__ERR", err);
            }
        };
        fetchMessages();
    }, [conversation]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            if (message.conversationId === conversation?._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [conversation]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const message = {
            conversationId: conversation?._id,
            sender: userId,
            text: newMessage,
        };

        try {
            const res = await axios.post('/api/message', message);
            setMessages((prev) => [...prev, res.data]);
            socket.emit('sendMessage', res.data);
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <ChatHeader conversation={conversation} />
            <div>
                {messages.map((msg) => (
                    <div key={msg._id} className={msg.sender._id === userId ? 'my-message' : 'other-message'}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatBox;
