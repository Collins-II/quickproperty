import Listing, { IListing } from "../lib/database/models/listing.model";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();
    console.log("FavariteUser", currentUser)

    if (!currentUser) {
      return [];
    }

    // Assuming currentUser.favoriteIds contains listing IDs
    const favorites = await Listing.find({ _id: { $in: currentUser.favoriteIds } });

    const safeFavorites = favorites.map((favorite: IListing) => ({
      ...favorite.toObject(),
      createdAt: favorite?.createdAt?.toString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    console.log("Favarites", error)
    throw new Error(error);
  }
}
