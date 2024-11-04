import { Document, Schema, model, models, Model, Types } from 'mongoose';

export interface ISuggestion extends Document {
    _id: string;
    message?: string;
    urlPath: string;
    userId: Types.ObjectId;
    createdAt: Date;
}


const SuggestionSchema = new Schema({
    message: { type: String },
    urlPath: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const Suggestion = (models && models.Suggestion) || model<ISuggestion>('Suggestion', SuggestionSchema);

export default Suggestion;

