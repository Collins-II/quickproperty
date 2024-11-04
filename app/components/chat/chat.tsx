"use client"
import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import ConversationList from "@/app/conversations/components/ConversationList";
import { IUser } from "@/app/lib/database/models/user.model";
import getConversations from "@/app/actions/getConversations";
import getUsers from "@/app/actions/getUsers";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ChatId from "./chatId/chat-id";
import { FullConversationType, FullMessageType } from "@/app/types";

interface ChatHomeProps {
    currentUser: IUser,
    conversationId: string
}

async function fetchConversations() {
    const conversations = await getConversations();
    console.log("FET_CONVOS", conversations)
    return conversations
    // Mock async function to fetch chat data
}

async function fetchMessages() {
    const users = await getUsers();
    return users
}

const ChatHome = ({ currentUser, conversationId }: ChatHomeProps) => {
    const [conversations, setConversations] = useState<FullConversationType[] | null>(null);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getChatData = async () => {
            try {
                const data = await fetchConversations();
                const messages = await fetchMessages()

                setConversations(data);
                setUsers(messages)
            } catch (error) {
                console.error('Error fetching chat data:', error);
            } finally {
                setLoading(false);
            }
        };

        getChatData();
    }, [conversationId]);



    return (
        <Sidebar currentUser={currentUser as IUser}>
            <div className="h-full pt-24">
                <ConversationList users={users as any} initialItems={conversations as any} />
                {conversationId && (<ChatId conversationId={conversationId} />)}
            </div>
        </Sidebar>
    );
}

export default ChatHome