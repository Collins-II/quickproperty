'use client';

import React from 'react';
import Select from 'react-select';

import useCountries from '@/app/hooks/useCountries';
import { Location } from '@/app/data'; // Assuming this is the correct import for Location

export type AddressSelectValue = {
  value: string;
  label: string;
};

interface AddressSelectProps {
  value?: AddressSelectValue;
  placeholder: string;
  data: Location[];
  onChange: (value: AddressSelectValue) => void;
}


const transformData = (data: Location[]): AddressSelectValue[] => {
  return data?.map(location => ({
    value: location.id || '',
    label: location?.name,
  }));
};


const AddressSelect: React.FC<AddressSelectProps> = ({
  value,
  placeholder,
  data,
  onChange
}) => {
  const transformedData = transformData(data);

  return (
    <div>
      <Select
        placeholder={`${placeholder} select`}
        isClearable
        options={transformedData}
        value={value}
        onChange={(value) => onChange(value as AddressSelectValue)}
        formatOptionLabel={(option: AddressSelectValue) => (
          <div className="flex flex-row items-center gap-3">
            <div>
              <span className="text-neutral-500 ml-1">
                {option.label}
              </span>

            </div>
          </div>
        )}
        classNames={{
          control: () => 'p-3 border-2',
          input: () => 'text-lg',
          option: () => 'text-lg'
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: 'black',
            primary25: '#ffe4e6'
          }
        })}
      />
    </div>
  );
}

export default AddressSelect;
