
import Conversation from '../lib/database/models/conversation.model';
import Message from '../lib/database/models/message.model';
import User from '../lib/database/models/user.model';
import getCurrentUser from './getCurrentUser';

const populateEvent = (query: any) => {
    return query
        .populate({ path: 'users', model: User, select: 'image name conversationIds seenMessageIds' })
        .populate({ path: 'messages', model: Message });
}

const getConversations = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
        return [];
    }

    try {
        const conversations = await populateEvent(Conversation.find({
            userIds: { $in: [currentUser._id] },
        })
            .sort({ lastMessageAt: -1 }));

        console.log("GET_CONVOS", conversations)
        return conversations;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default getConversations;
