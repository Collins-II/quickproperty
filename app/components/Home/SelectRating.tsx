"use client";

import Data from "../../Shared/Data";
import React, { useState } from "react";

// Define the type for the rating change handler
interface SelectRatingProps {
  onRatingChange: (selectedRatings: number[]) => void;
}

// Define the type for the rating list items
interface RatingItem {
  name: number; // Updated to match the type in Data.ratingList
  icon: React.ReactNode;
}

const SelectRating: React.FC<SelectRatingProps> = ({ onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState<number[]>([]);

  const onSelectRating = (isChecked: boolean, value: number) => {
    const updatedRatings = isChecked
      ? [...selectedRating, value]
      : selectedRating.filter((rating) => rating !== value);

    setSelectedRating(updatedRatings);
    onRatingChange(updatedRatings); // Pass the updated ratings to the parent
  };

  return (
    <div className="px-2 mt-5">
      <h2 className="font-bold">Select Rating</h2>
      <div>
        {Data.ratingList.map((item: RatingItem, index: number) => (
          <div key={index} className="flex justify-between">
            <label>{item.icon}</label>
            <input
              type="checkbox"
              onChange={(e) => onSelectRating(e.target.checked, item.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectRating;
