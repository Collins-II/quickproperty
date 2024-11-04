import mongoose from 'mongoose';
import Reservation, { IReservation } from "../lib/database/models/reservation.model";
import Listing, { IListing } from '../lib/database/models/listing.model';
import getCurrentUser from './getCurrentUser';

const populateEvent = (query: any) => {
  return query
    //.populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate(
      { path: 'reservations', model: Reservation, select: 'listingId' }
      // Add more populate options if needed
    )
}

export default async function getReservations() {
  try {
    const currentUser = await getCurrentUser();

    // Fetch reservations for the current user
    const reservations = await Reservation.find({ userId: currentUser._id })
      .sort({ createdAt: 'desc' })
      .exec();

    // If no reservations are found, return an empty array
    if (!reservations || reservations.length === 0) {
      return [];
    }

    // Extract listingIds from the reservations
    const listingIds = reservations.map((reservation) => reservation.listingId);

    // Fetch listings based on the listingIds
    const listings = await Listing.find({ _id: { $in: listingIds } }).populate(
      { path: 'reservationIds', model: Reservation }
    );

    // Convert listings to plain JavaScript objects
    const plainListings = listings.map((listing) => ({
      ...listing.toObject(),
      createdAt: listing.createdAt?.toString(),
    }));
    console.log("RESERVE_DAT", plainListings)
    return plainListings;
  } catch (error: any) {
    console.log("ERORRR", error)
    throw new Error(error);
  }
}
