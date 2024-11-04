'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "@/app/types"
  ;
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import { IListing } from "../lib/database/models/listing.model";
import ReservationCard from "../components/ui/reservation-card";
import PropertyCard from "./components/property-card";

interface ReservationsClientProps {
  reservations: IListing[],
  currentUser?: SafeUser | null,
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
      .then(() => {
        toast.success('Reservation cancelled');
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [router]);

  return (
    <Container>
      <Heading
        title="Reservations"
        subtitle="Bookings on your properties"
      />
      <div
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-3
          2xl:grid-cols-5
          gap-8
        "
      >
        {reservations.map((reservation: IListing) => (
          <PropertyCard
          data={reservation}
          image={reservation.imageSrc[0]}
          title={reservation.title as string}
          appointmentDate="12th December, 2023"
          appointmentTime="3:00 PM"
          location={reservation.compound as string}
        />
        ))}
      </div>
    </Container>
  );
}

export default ReservationsClient;