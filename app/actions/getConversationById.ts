import { connectToDatabase } from "../lib/database";
import Conversation from "../lib/database/models/conversation.model";
import Listing from "../lib/database/models/listing.model";
import Message from "../lib/database/models/message.model";
import User from "../lib/database/models/user.model";
import getCurrentUser from "./getCurrentUser";

interface IParams {
    conversationId: string;
}

const populateEvent = (query: any) => {
    return query
        .populate({ path: 'userIds users', model: User, })
        .populate({ path: 'messageIds messages', model: Message })
}

export default async function getConversationById(conversationId: string) {
    try {
        await connectToDatabase();
        // const user = await getCurrentUser();
        if (!conversationId) {
            return console.log("CONVO_ID_REQUIRED", conversationId);
        }

        const conversation = await populateEvent(Conversation.findById({ _id: conversationId }).sort({ "createdAt": 1 }));

        if (!conversation) {
            return null;
        }
        const plainConversation = {
            _id: conversation._id.toString(),
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessage,
            userIds: conversation.userIds,
            users: conversation.users,
            messageIds: conversation.messageIds,
            messages: conversation.messages
            // Add other properties as needed
        };
        console.log("List_Err_CONVERSATION", plainConversation)
        return JSON.parse(JSON.stringify(plainConversation));
    } catch (error: any) {
        console.log("List_Err", error)
        throw new Error(error);
    }
}
