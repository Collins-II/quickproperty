import { Schema, model, models, Document, Types } from "mongoose";
import Message from "./message.model";  // Import the Message model

export interface IConversation extends Document {
  _id: string;
  createdAt: Date;
  lastMessageAt: Date;
  isGroup?: boolean;
  name?: string;
  userIds: Types.ObjectId[];
  users: Types.ObjectId[];
  messageIds: Types.ObjectId[];
  messages: Types.ObjectId[];
}

const ConversationSchema = new Schema<IConversation>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },
  isGroup: {
    type: Boolean,
  },
  messageIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  userIds: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Conversation = (models && models.Conversation) || model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
