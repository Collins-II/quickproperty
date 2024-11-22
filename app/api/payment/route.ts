import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { connectToDatabase } from "@/app/lib/database";
import Reservation from "@/app/lib/database/models/reservation.model";
import User from "@/app/lib/database/models/user.model";
import Listing from "@/app/lib/database/models/listing.model";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, mobileNumber, listingId, totalPrice, selectedDate, selectedTime } = body;

        // Validate required fields
        if (!amount || !mobileNumber || !listingId || !totalPrice || !selectedDate || !selectedTime) {
            return new NextResponse('Bad Request: Missing required fields', { status: 400 });
        }

        // Connect to the database
        await connectToDatabase();

        // Fetch the current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Prepare the reservation data
        const reservationData = {
            userId: currentUser._id,
            listingId,
            totalPrice,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
        };

        // Create and save the reservation
        const reservation = new Reservation(reservationData);
        await reservation.save();

        // Get the ID of the newly created reservation
        const reservationId = reservation._id;

        // Update the listing with the new reservation and populate the `user` field
        const listingAndReservation = await Listing.findOneAndUpdate(
            { _id: listingId },
            { $addToSet: { reservationIds: reservationId } },
            { new: true }
        ).populate('user');

        if (!listingAndReservation) {
            return new NextResponse('Listing Not Found', { status: 404 });
        }

        console.log("PAY_RES:", listingAndReservation);

        return NextResponse.json(listingAndReservation);
    } catch (error) {
        console.log("Error updating listing or processing payment:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
