
import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

//import ListingClient from "./ListingClient";
import { Metadata } from 'next';
import ReservationClient from "./ReservationClient";

export interface IParams {
  params: {
    reservationId: string;
  }
}

export async function generateMetadata(
  { params }: IParams,
): Promise<Metadata> {
  // read route param

  // fetch data
  const listing = await getListingById({listingId:params.reservationId});

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

  const listing = await getListingById({listingId:params.reservationId});
  const reservations = await getReservations();
  const currentUser = await getCurrentUser();

// Parent Component
const reservationDateString = "2024-09-12T12:00:00.000Z"; // Example date string from API
const reservationDate = new Date(reservationDateString); // Convert to Date object



  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationClient
        listing={listing as any}
        reservationDate={reservationDate}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}

export default ListingPage;
