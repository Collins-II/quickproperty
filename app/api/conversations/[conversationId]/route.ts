import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Conversation from "@/app/lib/database/models/conversation.model"; // Assuming you have this model
import User from "@/app/lib/database/models/user.model"; // Assuming you have this model
import { pusherServer } from "@/app/lib/pusher";

interface IParams {
  conversationId?: string;
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  console.log(11, '/api/conversations/[conversationId]');
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await Conversation.findById(conversationId).populate("users");

    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    if (!existingConversation.userIds.includes(currentUser._id)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedConversation = await Conversation.deleteOne({
      _id: conversationId,
      userIds: { $in: [currentUser._id] },
    });

    existingConversation.users.forEach((user: any) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

    return NextResponse.json(deletedConversation);

  } catch (error) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
