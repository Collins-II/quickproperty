
import getConversationById from "@/app/actions/getConversationById"
import getMessages from "@/app/actions/getMessages"
import EmptyState from "@/app/components/EmptyState"
import Body from "@/app/conversations/[conversationId]/components/Body"
import Form from "@/app/conversations/[conversationId]/components/Form"
import Header from "@/app/conversations/[conversationId]/components/Header"
import useConversation from "@/app/hooks/useConversation"
import { FullConversationType, FullMessageType } from "@/app/types"
import React, { useState, useEffect } from 'react';

interface IParams {
    conversationId: string;
}

async function fetchConversations(conversationId: string) {
    const conversation = await getConversationById(conversationId)
    console.log("FETCH_CONVOS_ID", conversation)
    return conversation
    // Mock async function to fetch chat data
}

async function fetchMessages(conversationId: string) {
    const messages = await getMessages(conversationId)
    console.log("FETCH_MESSAGES_ID", messages)
    return messages
}

const ChatId: React.FC<IParams> = ({ conversationId }) => {
    const [conversation, setConversation] = useState<FullConversationType | null>(null);
    const [messages, setMessages] = useState<FullMessageType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    console.log("COMPO_CONVOS_ID", conversationId)

    useEffect(() => {
        const getChatData = async () => {
            if (conversationId) {
                setLoading(true)

                const messages = await fetchMessages(conversationId)
                console.log("FETCH_MESSAGES_ID", messages)
                const conversation = await fetchConversations(conversationId)
                console.log("FETCH_CONVOS_ID", conversation)

                setConversation(conversation);
                setMessages(messages)
                setLoading(false);
            }
        };

        getChatData();
    }, [conversationId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!conversationId) {
        return (
            <div className=" h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }

    return (
        <div className=" h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation as any} />
                <Body initialMessages={messages as FullMessageType[]} />
                <Form />
            </div>
        </div>
    )
}

export default ChatId