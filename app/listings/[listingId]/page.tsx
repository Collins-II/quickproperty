
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";
import { Metadata } from 'next';

export interface IParams {
  params: {
    listingId: string;
  }
}

export async function generateMetadata(
  { params }: IParams,
): Promise<Metadata> {
  // read route param

  // fetch data
  const listing = await getListingById(params);

  return {
    title: listing?.title,
    description: listing?.description,
    keywords: [listing?.title, listing?.property_type],
    icons: {
      icon: '/images/logo1.png'
    }
  }
}

const ListingPage = async ({ params }: IParams) => {

  const listing = await getListingById(params);
  const reservations = await getReservations();
  const currentUser = await getCurrentUser();

  console.log("LIST_NG", listing)

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing as any}
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}

export default ListingPage;
