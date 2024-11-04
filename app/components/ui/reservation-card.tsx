"use client";

import React, { useState } from 'react';

interface ReservationCardProps {
  propertyName: string;
  pricePerNight: number;
  totalNights: number;
  amenities: string[];
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  propertyName,
  pricePerNight,
  totalNights,
  amenities,
  checkInDate,
  checkOutDate,
  guests
}) => {
  const [isReserved, setIsReserved] = useState(false);

  const handleReservation = () => {
    setIsReserved(true);
    // Add further reservation logic, such as calling an API or managing form data.
  };

  const totalCost = pricePerNight * totalNights;

  return (
    <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">{propertyName}</h2>
      <p className="mt-2 text-lg text-gray-700">
        ${pricePerNight}/night • {totalNights} nights
      </p>

      <div className="my-4">
        <h3 className="text-xl font-semibold text-gray-800">Amenities</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>

      <div className="my-4">
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Check-in:</span> {checkInDate}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Check-out:</span> {checkOutDate}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Guests:</span> {guests}
        </p>
      </div>

      <div className="my-4">
        <p className="text-xl font-semibold text-gray-900">Total Cost: ${totalCost}</p>
      </div>

      <button
        onClick={handleReservation}
        className={`w-full py-2 px-4 mt-4 text-white font-bold rounded-lg 
          ${isReserved ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}
        `}
        disabled={isReserved}
      >
        {isReserved ? 'Reserved' : 'Reserve Now'}
      </button>
    </div>
  );
};

export default ReservationCard;
