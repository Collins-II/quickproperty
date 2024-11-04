import { Document, Schema, model, models, Model, Types } from 'mongoose';

export interface IMessage extends Document {
    _id: string;
    image?: string;
    content?: string;
    seenIds?: [Types.ObjectId];
    conversationId: string;
    senderId: Types.ObjectId;
    createdAt: Date;
}


const MessageSchema = new Schema({
    content: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
    seenIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    conversationId: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

/* Virtuals
MessageSchema.virtual('seen', {
    ref: 'User',
    localField: 'seenIds',
    foreignField: '_id'
});

// Ensure virtual fields are serialized
MessageSchema.set('toObject', { virtuals: true });
MessageSchema.set('toJSON', { virtuals: true });

*/

const Message = (models && models.Message) || model<IMessage>('Message', MessageSchema);

export default Message;

