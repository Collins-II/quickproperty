"use client"

import React, { useState, useEffect } from 'react';

interface CityFilterProps {
    province: string | null;
    district: string | null;
    onFilter: (city: string) => void;
}

const CityFilter: React.FC<CityFilterProps> = ({ province, district, onFilter }) => {
    const [cities, setCities] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the list of cities for the selected province and district from an API or database
        const fetchCities = async () => {
            if (province && district) {
                const response = await fetch(`/api/cities?province=${province}&district=${district}`);
                const data = await response.json();
                setCities(data.cities);
            } else {
                setCities([]);
            }
        };
        fetchCities();
    }, [province, district]);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        onFilter(city);
    };

    return (
        <div>
            <label htmlFor="city-filter">City:</label>
            <select id="city-filter" value={selectedCity || ''} onChange={handleCityChange}>
                <option value="">All</option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CityFilter;