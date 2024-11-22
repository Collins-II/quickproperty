"use client";

import React, { useState } from "react";

// Define the type for the component's props
interface RangeSelectProps {
  onRadiusChange: (radius: number) => void;
}

const RangeSelect: React.FC<RangeSelectProps> = ({ onRadiusChange }) => {
  const [radius, setRadius] = useState<number>(2500);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value, 10); // Convert string to number
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  return (
    <div className="mt-5 px-2">
      <h2 className="font-bold">Select Radius (In Meter)</h2>
      <input
        type="range"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        min="500"
        max="5000"
        step="500"
        onChange={handleRadiusChange}
        defaultValue={radius}
      />
      <label className="text-gray-500 text-[15px]">{radius} in Meter</label>
    </div>
  );
};

export default RangeSelect;
