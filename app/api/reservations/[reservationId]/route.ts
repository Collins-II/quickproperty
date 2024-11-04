import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Reservation from "@/app/lib/database/models/reservation.model";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId !== 'string') {
    throw new Error('Invalid ID');
  }

  // Convert reservationId to ObjectId
  const objectId = reservationId;

  // MongoDB deleteMany query
  const reservation = await Reservation.deleteMany({
    _id: objectId,
    $or: [
      { userId: currentUser.id },
      { "listing.userId": currentUser.id }
    ]
  });

  return NextResponse.json(reservation);
}
