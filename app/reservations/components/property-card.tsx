"use client";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import ReservedModal from "./reservationModal";
import { useProperty } from "@/app/context/PropertyContext";
import { IListing } from "@/app/lib/database/models/listing.model";
import RescheduleModal from "./rescheduleModal";
import { useReschedule } from "@/app/context/RescheduleContext";
import { useViewContext } from "@/app/context/ViewReserveContext";

interface PropertyCardProps {
  data:IListing;
  image: string;
  title: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
}

export default function PropertyCard({
  data,
  image,
  title,
  appointmentDate,
  appointmentTime,
  location,
}: PropertyCardProps) {
    const router = useRouter();
    const { isModalOpenRes,setSelectedPropertyRes, setIsModalOpenRes } = useReschedule();
    const { isModalOpenView,setSelectedPropertyView, setIsModalOpenView } = useViewContext();

    const handleDetailsClick = () => {
        setSelectedPropertyView(data as any); // Set the property to the context
        setIsModalOpenView(true); // Open the modal
    };

    const handleRescheduleClick = () => {
      setSelectedPropertyRes(data as any); // Set the property to the context
      setIsModalOpenRes(true); // Open the modal
  };

  return (
    <div
    className="relative col-span-1 cursor-pointer group shadow-xs rounded-md bg-transparent"
  >
    <div className="relative flex flex-col items-center w-full p-6 bg-gradient-to-r from-neutral-200 to-neutral-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Property Image */}
      <div className="w-full h-48 overflow-hidden rounded-lg mb-4 shadow-md">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center rounded-lg"
        />
      </div>

      {/* Property Details */}
      <div className="text-center text-white">
        {/* Title */}
        <h2 className="text-xl font-extrabold tracking-wide capitalize mb-2">{title}</h2>
        
        {/* Location */}
        <p className="text-sm font-semibold text-white mb-4">{location}</p>

        {/* Appointment Date and Time */}
        <div className="flex flex-col items-center text-sm text-gray-200">
          <p className="mb-1">
            <span className="font-bold text-gray-50">Date:</span> {appointmentDate}
          </p>
          <p>
            <span className="font-bold text-gray-50">Time:</span> {appointmentTime}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleDetailsClick} className="px-6 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          View Details
        </button>
        <button onClick={handleRescheduleClick} className="px-6 py-2 bg-green-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-green-700 transition duration-300">
          Reschedule
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-12 h-12 rounded-bl-full bg-white opacity-70"></div>
      {/*<div className="absolute bottom-0 left-0 w-10 h-10 rounded-tr-full bg-neutral-500 opacity-70"></div>
        Share Modal */}
       
    </div>
    {isModalOpenView && <ReservedModal isOpen={isModalOpenView} onClose={() => setIsModalOpenView(false)} />}
      {isModalOpenRes && <RescheduleModal isOpen={isModalOpenRes} onClose={() => setIsModalOpenRes(false)} />}
    </div>
  );
}
