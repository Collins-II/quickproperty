"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ConversationType } from '../types';
import { useSession } from 'next-auth/react';
import getConversationById from '../actions/getConversationById';
import getConversations from '../actions/getConversations';
import { IConversation } from '../lib/database/models/conversation.model';
import { IUser } from '../lib/database/models/user.model';
import { IListing } from '../lib/database/models/listing.model';

interface ChatBoxProps {
    conversation: IConversation & {
        users: IUser[],
        listing: IListing
    }
}
interface SidebarProps {
    selectConversation: React.Dispatch<React.SetStateAction<ChatBoxProps | undefined>>;
}

const Sidebar = ({ selectConversation }: SidebarProps) => {
    const { data: session } = useSession();
    const userId = session?.user?._id;
    const [conversations, setConversations] = useState<ChatBoxProps[]>([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await getConversations();
                console.log("CONVER_SATIONS", res)
                setConversations(res);
            } catch (err) {
                console.error(err);
            }
        };
        fetchConversations();
    }, [userId]);

    return (
        <div>
            <h2>Conversations</h2>
            <ul>
                {conversations.map((conv) => (
                    <li key={conv.conversation._id} onClick={() => selectConversation(conv)}>
                        Conversation with {conv.conversation.members.senderId !== userId ? conv.conversation.members.senderId : conv.conversation.members.receiverId}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
