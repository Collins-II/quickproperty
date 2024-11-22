'use client';
import React, { useCallback, useState } from "react";
import { Range } from "react-date-range";
import Button from "../Button";
import Calendar from "../inputs/Calendar"; // Assuming this is your calendar component
import useReservationModal from "@/app/hooks/useReservationModal";
import Chat from "../Chat";
import { SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { IListing } from "@/app/lib/database/models/listing.model";
import Avatar from "../Avatar";
import { useRouter } from "next/navigation"; // Adjusted import for Next.js routing
import Image from "next/image";
import HostGrading from "../ui/host-grading";
import Appointment from "../appointment";
import { useProperty } from "@/app/context/PropertyContext";
import Notice from "../ui/notice";

// Interface for the component props
interface ListingReservationProps {
  propertyUserId: string;
  listing: IListing;
  listingId: string;
  currentUser: SafeUser;
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates?: Date[];
  locationValue: string;
  category: string;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  propertyUserId,
  listing,
  listingId,
  currentUser,
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  locationValue,
  category,
}) => {
  let perCent = 0.5 / 10
  const { data: session } = useSession();
  const userId = session?.user._id;
  const user = session?.user;
  const router = useRouter();
  const { setSelectedDate, setSelectedTime, selectedDate, selectedTime } = useProperty();
  const reservationModal = useReservationModal();
  const reservationFee = perCent * totalPrice;
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);

  const handleCancel = () => {
    console.log('Reservation cancelled');
    setIsNoticeVisible(false);
  };

  const onReserve = useCallback((data: any) => {
    reservationModal.propertyUserId = data.userId;
    reservationModal.listingId = data.listing._id;
    reservationModal.price = reservationFee;
    reservationModal.onOpen();
  }, [reservationModal, reservationFee]);

  const handleContinue = () => {
    console.log('Continuing with reservation');
    onReserve({ listing, userId: propertyUserId })
    setIsNoticeVisible(false);
    // Add logic to proceed with the reservation
  };

  const handleProfile = () => {
    router.push(`/profile/${user?._id}`);
  };

  const isReserveDisabled = !selectedDate || !selectedTime; // Disable button if no date/time selected

  return (
    <div className="
      bg-white 
      rounded-xl
      md:border-[1px]
      border-neutral-200 
      overflow-hidden
      relative
    ">
      <div className="flex flex-col gap-1 p-4">
        <div className="
          
          flex 
          flex-row 
          items-center
          gap-2
          cursor-pointer
        "
          onClick={handleProfile}
        >
          <Image
            className="rounded-full"
            height="50"
            width="50"
            alt="Avatar"
            src={user?.image || '/images/placeholder.jpg'}
          />
          <div className="flex flex-col w-full gap-1 p-2">
            <p className="text-1xl font-semibold">{user?.name}</p>
            <p className="text-1xl font-light text-slate-600">Host</p>
          </div>
        </div>
        {/*<HostGrading propertiesListed={40 || 0} />*/}
      </div>
      <hr />

      {/* Calendar for selecting reservation dates 
      <div className="p-4">
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => onChangeDate(value.selection)}
        />
      </div>*/}
      <Appointment setSelectedDate={setSelectedDate} setSelectedTime={setSelectedTime} selectedDate={selectedDate} selectedTime={selectedTime} />

      <div className="
        p-4 
        flex 
        flex-row 
        items-center 
        justify-between
        font-semibold
        text-lg
      ">
        <div>Reservation fee</div>
        <div>ZMW {reservationFee}</div>
      </div>
      <hr />

      {isNoticeVisible && (
        <Notice
          percentageCharge={perCent} // Example charge percentage
          onCancel={handleCancel}
          onContinue={handleContinue}
        />
      )}

      {userId !== propertyUserId ? (
        <div className="p-4">
          <Button
            disabled={isReserveDisabled} // Disable button if no date/time selected
            label="Poke Host"
            onClick={() => setIsNoticeVisible(true)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ListingReservation;
