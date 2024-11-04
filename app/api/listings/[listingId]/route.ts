import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/app/lib/database/models/listing.model";
import { getUserByEmail } from "@/app/actions/user.actions";
import { handleError } from "@/app/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== 'string') {
    throw new Error('Invalid ID');
  }

  try {
    const result = await Listing.deleteOne({
      _id: listingId,
      userId: currentUser._id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(new Error("Listing not found or user not authorized to delete it"));
    }

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(new Error("An error occurred while deleting the listing"));
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const body = await request.json();
    const {
      email
    } = body;

    const currentUser = await getUserByEmail(email);

    if (!currentUser) {
      return console.error(new Error("Unauthorized"), { status: 401 });
    }
    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID');
    }


    // Check for missing fields in the request body
    const requiredFields = ["title", "description", "imageSrc", "category", "roomCount", "bathroomCount", "guestCount", "location", "price", "costRange", "province", "district", "compound", "property_type"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return console.error(`Missing field: ${field}`, { status: 400 });
      }
    }

    // Find the existing listing
    const existingListing = await Listing.findById(listingId);

    if (!existingListing || existingListing.userId !== currentUser._id) {
      return console.error(
        new Error("Listing not found or user not authorized to update it"),
        { status: 404 }
      );
    }

    // Update the existing listing fields
    existingListing.title = body.title;
    existingListing.description = body.description;
    existingListing.imageSrc = body.imageSrc;
    existingListing.category = body.category;
    existingListing.province = body.province;
    existingListing.district = body.district;
    existingListing.compound = body.compound;
    existingListing.roomCount = body.roomCount;
    existingListing.bathroomCount = body.bathroomCount;
    existingListing.guestCount = body.guestCount;
    existingListing.locationValue = body.location.value;
    existingListing.costRange = body.costRange;
    existingListing.property_type = body.property_type;
    existingListing.price = parseInt(body.price, 10);

    // Save the updated listing
    const updatedListing = await existingListing.save();


    return NextResponse.json(updatedListing, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("LISTING_ERR", error)
    handleError(error)
  }
}
