"use client"

import React, { useState, useEffect } from 'react';

interface DistrictFilterProps {
    province: string | null;
    onFilter: (district: string) => void;
}

const DistrictFilter: React.FC<DistrictFilterProps> = ({ province, onFilter }) => {
    const [districts, setDistricts] = useState<string[]>([]);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the list of districts for the selected province from an API or database
        const fetchDistricts = async () => {
            if (province) {
                const response = await fetch(`/api/districts?province=${province}`);
                const data = await response.json();
                setDistricts(data.districts);
            } else {
                setDistricts([]);
            }
        };
        fetchDistricts();
    }, [province]);

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const district = e.target.value;
        setSelectedDistrict(district);
        onFilter(district);
    };

    return (
        <div>
            <label htmlFor="district-filter">District:</label>
            <select id="district-filter" value={selectedDistrict || ''} onChange={handleDistrictChange}>
                <option value="">All</option>
                {districts.map((district) => (
                    <option key={district} value={district}>
                        {district}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DistrictFilter;