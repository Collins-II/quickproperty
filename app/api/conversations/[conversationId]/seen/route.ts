import { NextResponse } from "next/server";
import mongoose from "mongoose";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/lib/pusher';
import Conversation from "@/app/lib/database/models/conversation.model";
import Message from "@/app/lib/database/models/message.model";
import User from "@/app/lib/database/models/user.model"; // Assuming a User model exists

interface IParams {
  conversationId?: string;
}

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'users', model: User, select: 'image name conversationIds seenMessageIds' })
    .populate({ path: 'messages', model: Message, select: 'senderId conversationId' });
}

export async function POST(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find existing conversation
    const conversation = await populateEvent(Conversation.findById(conversationId))

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    // Update seen of last message
    lastMessage.seenIds?.push(currentUser._id);
    await lastMessage.save();

    const updatedMessage = await Message.findById(lastMessage._id)
      .populate('senderId')
      .populate('seenIds');

    // Update all connections with new seen
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });

    // If user has already seen the message, no need to go further
    if (lastMessage.seenIds?.includes(currentUser._id)) {
      return NextResponse.json(conversation);
    }

    // Update last message seen
    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return new NextResponse('Success');
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Error', { status: 500 });
  }
}
