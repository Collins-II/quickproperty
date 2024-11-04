import { Schema, Types, model, models } from "mongoose";
import { IAccount } from "./account.model";
import { IListing } from "./listing.model";
import { IReservation } from "./reservation.model";

export interface IUser extends Document {
  _id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  hashedPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
  favoriteIds?: string[];
  accounts?: Types.ObjectId | IAccount; // Assuming IAccount is defined elsewhere
  listings?: Types.ObjectId[] | IListing[]; // Assuming IListing is defined elsewhere
  reservations?: Types.ObjectId[] | IReservation[]; // Assuming IReservation is defined elsewhere
  conversationIds?: string[];
  conversations?: Types.ObjectId[];
  seenMessageIds?: string[];
  seenMessages?: Types.ObjectId[];
}

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  hashedPassword: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  favoriteIds: [
    {
      type: String
    }],
  conversationIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  }],
  seenMessageIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
  }],
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Define the indexes
UserSchema.index({ email: 1 }, { unique: true });

// Define virtuals for relationships
UserSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: 'conversationIds',
  foreignField: '_id',
});

UserSchema.virtual('seenMessages', {
  ref: 'Message',
  localField: 'seenMessageIds',
  foreignField: '_id',
});

// Ensure virtual fields are serializable
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = (models && models.User) || model<IUser>('User', UserSchema);

export default User;