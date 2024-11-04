import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import Conversation from "@/app/lib/database/models/conversation.model";
import User from "@/app/lib/database/models/user.model"; // Assuming you have a User model
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?._id || !currentUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = new Conversation({
        name,
        isGroup,
        userIds: [
          ...members.map((member: { value: string }) => member.value),
          currentUser._id,
        ],
      });

      await newConversation.save();

      // Populate users for pusher notifications
      const populatedConversation = await newConversation.populate('userIds');

      populatedConversation.userIds.forEach((user: any) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', populatedConversation);
        }
      });

      return NextResponse.json(populatedConversation);
    }

    const existingConversations = await Conversation.find({
      $or: [
        { userIds: { $all: [currentUser._id, userId] } },
        { userIds: { $all: [userId, currentUser._id] } },
      ],
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = new Conversation({
      userIds: [currentUser._id, userId],
    });

    await newConversation.save();

    // Populate users for pusher notifications
    const populatedNewConversation = await newConversation.populate('userIds');

    populatedNewConversation.userIds.forEach((user: any) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', populatedNewConversation);
      }
    });

    return NextResponse.json(populatedNewConversation);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
