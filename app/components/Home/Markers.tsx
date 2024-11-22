'use client';

import React, { useContext, useState } from 'react';
import { useSelectedBusiness } from "../../context/SelectedBusinessContext";
import { IListing } from "@/app/lib/database/models/listing.model";

interface MarkersProps {
  business: IListing;
}

const Markers: React.FC<MarkersProps> = ({ business }) => {
  const context = useSelectedBusiness();

  if (!context) {
    throw new Error("SelectedBusinessContext must be used within a SelectedBusinessProvider");
  }

  const { selectedBusiness, setSelectedBusiness } = context;

  // Local state to manage hover effects for the marker
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Marker */}
      <div
        onClick={() => setSelectedBusiness(business)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-4 h-4 rounded-full bg-blue-600 cursor-pointer transition-all transform ${
          selectedBusiness?.description === business.description || isHovered
            ? 'scale-125 bg-blue-800'
            : 'scale-100'
        }`}
      ></div>

      {/* Overlay */}
      {(selectedBusiness?.description === business.description || isHovered) && (
        <div
          className="absolute z-50 -top-36 -left-24 bg-white shadow-lg rounded-md p-4 w-56"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="font-bold text-gray-800">{business.title}</div>
          <p className="text-sm text-gray-500 mt-1">{business.description}</p>
          <div className="mt-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
              onClick={() => console.log(`Show directions for ${business.title}`)}
            >
              Show Directions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markers;
