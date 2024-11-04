import { connectToDatabase } from "../lib/database";
import Listing, { IListing } from "../lib/database/models/listing.model";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  province?: string;
  district?: string;
  compound?: string;
  isReserved?: boolean;
  isPremium?: boolean;
  property_type?: string;
}

export default async function getListings(
  params: IListingsParams
): Promise<IListing[]> {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      isReserved,
      isPremium,
      startDate,
      endDate,
      category,
      province,
      district,
      compound,
      property_type
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (isReserved) {
      query.isReserved = isReserved;
    }

    if (isPremium) {
      query.isPremium = isPremium;
    }

    if (category) {
      query.category = category;
    }

    if (compound) {
      query.compound = compound;
    }

    if (property_type) {
      query.property_type = property_type;
    }

    if (province) {
      query.province = province;
    }

    if (roomCount) {
      query.roomCount = {
        $gte: roomCount
      }
    }

    if (guestCount) {
      query.guestCount = {
        $gte: guestCount
      }
    }

    if (bathroomCount) {
      query.bathroomCount = {
        $gte: bathroomCount
      }
    }

    if (startDate && endDate) {
      query.$or = [
        {
          'reservations.endDate': { $gte: startDate },
          'reservations.startDate': { $lte: startDate }
        },
        {
          'reservations.startDate': { $lte: endDate },
          'reservations.endDate': { $gte: endDate }
        }
      ];
    }
    await connectToDatabase(); // Ensure connection is awaited

    const listings = await Listing.find(query).sort({ createdAt: -1 });

    const safeListings = listings.map((listing: IListing) => ({
      ...listing.toObject(),
      createdAt: listing?.createdAt?.toISOString(),
    }));

    return safeListings;
  } catch (error: any) {
    console.log("err", error)
    throw new Error(error);
  }
}
