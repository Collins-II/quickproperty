"use client";

import React, { useState } from 'react';
import ProvinceFilter from './ProvinceFilter';
import DistrictFilter from './DistrictFilter';
import CityFilter from './CityFilter';
import { IListing } from '@/app/lib/database/models/listing.model';

interface FilterData {
    data: IListing[]
}

const FilterIndex = ({ data }: FilterData) => {
    const [filteredEstates, setFilteredEstates] = useState<IListing[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const estates = [] as any

    const handleProvinceFilter = (province: string) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedCity(null);
        // Filter the estates based on the selected province
        const filtered = estates?.filter((estate: any) => estate.province === province);
        setFilteredEstates(filtered);
    };

    const handleDistrictFilter = (district: string) => {
        setSelectedDistrict(district);
        setSelectedCity(null);
        // Filter the estates based on the selected district
        const filtered = filteredEstates.filter((estate) => estate.district === district);
        setFilteredEstates(filtered);
    };

    const handleCityFilter = (city: string) => {
        setSelectedCity(city);
        // Filter the estates based on the selected city
        const filtered = filteredEstates.filter((estate) => estate.city === city);
        setFilteredEstates(filtered);
    };

    return (
        <div className='mt-10'>
            <h1>Zambia Home Estates</h1>
            <div className='flex flex-row gap-5'>
                <ProvinceFilter onFilter={handleProvinceFilter} />
                <DistrictFilter province={selectedProvince} onFilter={handleDistrictFilter} />
                <CityFilter province={selectedProvince} district={selectedDistrict} onFilter={handleCityFilter} />
            </div>
            {/* Display the filtered estates */}
            {filteredEstates.map((estate) => (
                <div key={estate.id}>
                    <h2>{estate.title}</h2>
                    <p>Province: {estate.province}</p>
                    <p>District: {estate.district}</p>
                    <p>City: {estate.city}</p>
                    {/* Display other estate details */}
                </div>
            ))}
        </div>
    );
};

export default FilterIndex;