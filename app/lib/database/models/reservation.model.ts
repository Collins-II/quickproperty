import { Document, Schema, model, models } from "mongoose";
import { IListing } from "./listing.model";
import { IUser } from "./user.model";

export interface IReservation extends Document {
  _id: string;
  userId: string,
  listingId: string,
  appointmentDate?: Date,
  appointmentTime?: string,
  totalPrice: number,
  createdAt: Date,

  price?: number;
  user?: Schema.Types.ObjectId | IUser; // Reference to IUser
  listings?: Schema.Types.ObjectId | IListing;
}

const ReservationSchema = new Schema({
  userId: { type: String },
  listingId: { type: String },
  appointmentDate: { type: Date },
  appointmentTime: { type: String },
  totalPrice: { type: Number },
  createdAt: { type: Date, default: Date.now },

  user: { type: Schema.Types.ObjectId, ref: 'User' },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
})

const Reservation = models.Reservation || model('Reservation', ReservationSchema);

export default Reservation;