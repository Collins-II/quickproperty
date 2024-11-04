import { connectToDatabase } from "../lib/database";
import Listing from "../lib/database/models/listing.model";
import User from "../lib/database/models/user.model";

interface IParams {
  listingId?: string;
}

const populateEvent = (query: any) => {
  return query
    //.populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate(
      { path: 'user', model: User, select: '_id name image email ' }
      // Add more populate options if needed
    )
}

export default async function getListingById(
  params: IParams
) {
  try {
    await connectToDatabase();
    const { listingId } = params;

    const listing = await populateEvent(Listing.findById({ _id: listingId }));

    if (!listing) {
      return null;
    }

    // Convert the listing object to a plain structure
    const plainListing = {
      _id: listing._id.toString(),
      title: listing.title,
      description: listing.description,
      imageSrc: listing.imageSrc,
      category: listing.category,
      province: listing.province,
      district: listing.district,
      compound: listing.compound,
      roomCount: listing.roomCount,
      bathroomCount: listing.bathroomCount,
      guestCount: listing.guestCount,
      locationValue: listing.locationValue,
      isReserved: listing.isReserved,
      isPremium: listing.isPremium,
      premiumTargetDate: listing.premiumTargetDate,
      property_type: listing.property_type,
      reservations: listing.reservations,
      price: listing.price,
      createdAt: listing.createdAt.toString(),
      user: listing.user
      // Add other properties as needed
    };

    return JSON.parse(JSON.stringify(plainListing));
  } catch (error: any) {
    console.log("List_Err", error)
    throw new Error(error);
  }
}
