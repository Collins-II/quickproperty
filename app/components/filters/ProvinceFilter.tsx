"use client";

import React, { useState, useEffect } from 'react';

interface ProvinceFilterProps {
    onFilter: (province: string) => void;
}

const ProvinceFilter: React.FC<ProvinceFilterProps> = ({ onFilter }) => {
    const [provinces, setProvinces] = useState<string[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the list of provinces from an API or database
        const fetchProvinces = async () => {
            const response = await fetch('/api/provinces');
            const data = await response.json();
            setProvinces(data.provinces);
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const province = e.target.value;
        setSelectedProvince(province);
        onFilter(province);
    };

    return (
        <div>
            <label htmlFor="province-filter">Province:</label>
            <select id="province-filter" value={selectedProvince || ''} onChange={handleProvinceChange}>
                <option value="">All</option>
                {provinces.map((province) => (
                    <option key={province} value={province}>
                        {province}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProvinceFilter;