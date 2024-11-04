import { NextResponse } from "next/server";
import mongoose from "mongoose";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/app/lib/database/models/listing.model";
import { getUserByEmail } from "@/app/actions/user.actions";
import Reservation from "@/app/lib/database/models/reservation.model";
import { connectToDatabase } from "@/app/lib/database";
import User from "@/app/lib/database/models/user.model";

export async function POST(
  request: Request,
) {
  const body = await request.json();
  const {
    listingId,
    startDate,
    endDate,
    totalPrice
  } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!listingId || !totalPrice) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const reservationData = {
    userId: currentUser._id,
    listingId,
    startDate,
    endDate,
    totalPrice
  }

  try {
    await connectToDatabase(); // Connect to MongoDB
    // Create a new reservation document
    const reservation = new Reservation(reservationData);
    await reservation.save();

    // Get the ID of the newly created reservation
    const reservationId = reservation._id;

    // Find the listing document by ID and update it with the reservation ID

    const listingAndReservation = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $addToSet: { reservations: reservationId } }, { new: true });

    if (!listingAndReservation) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(listingAndReservation);
  } catch (error) {
    console.log("Error updating listing:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
