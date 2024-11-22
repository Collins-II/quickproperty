import { Document, Schema, model, models } from "mongoose";
import { IReservation } from "./reservation.model";
import { IUser } from "./user.model";

export interface IListing extends Document {
  _id: string;
  title?: string;
  description?: string;
  imageSrc: string[];
  createdAt?: Date;
  bookingEndDate: Date;
  bookingTotalCharge: number;
  bookingStartDate: Date;
  bookingDuration: number;
  category?: string;
  compound?: string;
  roomCount?: number;
  bathroomCount?: number;
  guestCount?: number;
  location: {
    lat: number,
    lng: number
  },
  province?: string;
  district?: string;
  city?: string;
  area?: number;
  plot_size?: number;
  isReserved: boolean;
  isPremium: boolean;
  premiumTargetDate: Date;
  property_type?: string;
  costRange: string;
  userId: Schema.Types.ObjectId;
  price?: number;
  amenities?: string[];
  reservationIds?: Schema.Types.ObjectId[];
  user?: Schema.Types.ObjectId | IUser; // Reference to IUser
  reservations?: [Schema.Types.ObjectId | IReservation];
}

const ListingSchema = new Schema({
  title: { type: String },
  description: { type: String },
  imageSrc: { type: Array },
  createdAt: { type: Date, default: Date.now },
  bookingEndDate: { type: Date },
  bookingTotalCharge: { type: Number },
  bookingStartDate: { type: Date },
  bookingDuration: { type: Number },
  category: { type: String },
  compound: { type: String },
  roomCount: { type: Number },
  bathroomCount: { type: Number },
  guestCount: { type: Number },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  province: { type: String },
  district: { type: String },
  city: { type: String },
  area: { type: Number },
  plot_size: { type: Number },
  isReserved: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumTargetDate: { type: Date, default: Date.now },
  property_type: { type: String },
  costRange: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number },
  reservationIds: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
  amenities: [{ type: String }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }],
});

const Listing = (models && models.Listing) || model<IListing>('Listing', ListingSchema);

export default Listing;
