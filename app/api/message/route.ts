import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";
import mongoose from "mongoose";
import Message from "@/app/lib/database/models/message.model";
import Conversation from "@/app/lib/database/models/conversation.model";
import User from "@/app/lib/database/models/user.model";

const populateEvent = (query: any) => {
    return query
        .populate({ path: 'users', model: User, select: 'image name conversationIds seenMessageIds' })
        .populate({ path: 'messages', model: Message, select: 'senderId conversationId' });
}

export async function POST(req: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();

        const { message, image, conversationId } = body;

        if (!currentUser?._id || !currentUser?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Create a new message using Mongoose
        const newMessage = await Message.create({
            content: message,
            image: image,
            conversationId: conversationId,
            senderId: currentUser._id, // changed from currentUser.id to currentUser._id
            seenIds: [currentUser._id]
        });

        // Update the conversation with the new message
        const updatedConversation = await populateEvent(Conversation.findByIdAndUpdate({
            _id: conversationId, lastMessageAt: new Date(), messages: [newMessage._id]
        }));


        if (!updatedConversation) {
            return new NextResponse('Conversation not found', { status: 404 });
        }

        await pusherServer.trigger(conversationId, 'messages:new', newMessage);

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

        updatedConversation.users.forEach((user: any) => {
            pusherServer.trigger(user.email, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            });
        });

        return NextResponse.json(newMessage);

    } catch (error: any) {
        console.log("Error creating message:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
