import { connectToDatabase } from "../lib/database";
import Message, { IMessage } from "../lib/database/models/message.model";
import Listing from "../lib/database/models/listing.model";
import User from "../lib/database/models/user.model";


const populateEvent = (query: any) => {
  return query
    //.populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate(
      { path: 'senderId', model: User, select: 'name image email _id' }
      // Add more populate options if needed
    )
}

export default async function getMessages(
  conversationId: string
) {
  try {
    await connectToDatabase();

    const messages: IMessage[] | null = await populateEvent(Message.find({ conversationId }).sort({ "createdAt": 1 }));

    if (!messages || messages.length === 0) {
      console.log("No messages found for conversation ID:", conversationId);
      return null; // Return null if no messages are found
    }

    const plainMessages = messages.map((message: any) => {
      if (!message.senderId) {
        return {
          _id: message._id.toString(),
          image: message.image,
          content: message.content,
          seen: message.seen,
          conversationId: message.conversationId.toString(),
          senderId: null,
          sender: null,
          createdAt: message.createdAt,
        };
      }

      return {
        _id: message._id.toString(),
        image: message.image,
        content: message.content,
        seen: message.seen,
        conversationId: message.conversationId.toString(),
        senderId: message.senderId._id.toString(),
        sender: {
          name: message.senderId.name,
          email: message.senderId.email,
          image: message.senderId.image
        },
        createdAt: message.createdAt,
      };
    });
    console.log("CHAT_MESSAGES", plainMessages);

    return JSON.parse(JSON.stringify(plainMessages));
  } catch (error: any) {
    console.log("List_Err", error)
    throw new Error(error);
  }
}
