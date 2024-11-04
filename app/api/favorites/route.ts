import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/app/lib/database/index"; // Assuming you have a MongoDB connection setup
import User from "@/app/lib/database/models/user.model";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("favorites", body)
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const Id = body.listingId;

    if (!Id || typeof Id !== 'string') {
      throw new Error('Invalid ID');
    }

    await connectToDatabase(); // Connect to MongoDB

    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $addToSet: { favoriteIds: Id } }, // Add the listingId to the favoriteIds array if it's not already present
      { returnDocument: 'after' } // Return the updated document after the update operation
    );

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.log("Fa vErr", error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { listingId } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID');
    }

    await connectToDatabase(); // Connect to MongoDB

    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUser._id },
      { $pull: { favoriteIds: listingId } }, // Remove the listingId from the favoriteIds array
      { returnDocument: 'after' } // Return the updated document after the update operation
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("Fa vErr", error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
