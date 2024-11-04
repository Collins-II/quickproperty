import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import Listing from "@/app/lib/database/models/listing.model";
import { handleError } from "@/app/lib/utils";
import { getUserByEmail, getUserById } from "@/app/actions/user.actions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();
    const {
      email,
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      price,
      province,
      district,
      compound,
      property_type,
      amenities
    } = body;

    const currentUser = await getUserByEmail(email);

    if (!currentUser) {
      return console.error(new Error("Unauthorized"), { status: 401 });
    }


    // Check for missing fields in the request body
    const requiredFields = ["title", "description", "imageSrc", "category", "roomCount", "bathroomCount", "guestCount", "price", "province", "district", "compound", "property_type"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return console.error(`Missing field: ${field}`, { status: 400 });
      }
    }

    const listing = await Listing.create({
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      province,
      district,
      compound,
      property_type,
      amenities,
      price: parseInt(price, 10),
      userId: currentUser._id,
      user: currentUser
    });

    return NextResponse.json(listing, {
      headers: corsHeaders
    });
  } catch (error) {
    console.log("LISTING_ERR", error)
    handleError(error)
  }
}
