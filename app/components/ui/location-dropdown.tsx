"use client"

import React, { useState } from 'react';
import { provinces, districts, towns, Location } from '../../data';

interface LocationDropdownProps {
  label: string;
  options: Location[];
  onSelect: (location: Location) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ label, options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<Location | null>(null);

  const handleOptionChange = (option: Location) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <div>
      <label>{label}</label>
      <select
        value={selectedOption?.name || ''}
        onChange={(e) => handleOptionChange(options.find((o) => o.name === e.target.value)!)}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
      {selectedOption?.subLocations && (
        <LocationDropdown
          label="Sub-location"
          options={selectedOption.subLocations}
          onSelect={handleOptionChange}
        />
      )}
    </div>
  );
};

export default LocationDropdown;
