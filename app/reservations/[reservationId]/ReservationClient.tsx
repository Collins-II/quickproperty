"use client";

import { useState, useMemo, useEffect } from "react";
import { SafeListing, SafeUser } from "@/app/types";
import { format, addDays } from "date-fns";
import { toast } from "react-hot-toast";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure to install this
import Container from "@/app/components/Container";

interface ReservationClientProps {
  listing: SafeListing;
  currentUser: SafeUser;
  reservationDate: Date;
}

const ReservationClient: React.FC<ReservationClientProps> = ({
  listing,
  currentUser,
  reservationDate,
}) => {
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize available dates for setting the appointment (within 7 days)
  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      addDays(reservationDate, i + 1)
    );
  }, [reservationDate]);

  const handleDateChange = (date: Date | null, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
    if (date) {
      // Handle the case where a valid date is selected
      setAppointmentDate(date)
    } else {
      // Handle the case where no date is selected (null)

      setAppointmentDate(undefined)
    }
  };

  const handleAppointmentSubmit = async () => {
    if (!appointmentDate) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      // Make an API call to save the appointment date (this is a placeholder)
      await axios.post("/api/appointments", {
        listingId: listing._id,
        userId: currentUser._id,
        appointmentDate,
      });

      toast.success("Appointment set successfully!");
    } catch (error) {
      toast.error("Failed to set appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
          sm:pt-20
          md:pt-10
        "
      >
        <h1 className="text-3xl font-bold mb-4">Your Reserved Property</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Property Details */}
          <div className="border rounded-lg shadow p-4">
            <img
              src={listing.imageSrc[0]}
              alt={listing.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600">{listing.description}</p>
          </div>

          {/* Appointment Date Picker */}
          <div className="border rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-2">Set Appointment</h3>
            <p className="mb-4">Select a date within 7 days of your reservation.</p>
            <DatePicker
              selected={appointmentDate}
              onChange={handleDateChange}
              includeDates={availableDates}
              inline
            />
            <button
              onClick={handleAppointmentSubmit}
              disabled={isSubmitting}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Setting..." : "Set Appointment"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
            Download Receipt
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Share Receipt
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
            Print Receipt
          </button>
        </div>
      </div>
    </Container>
  );
};

export default ReservationClient;
