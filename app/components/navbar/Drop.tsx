"use client";

import { useState } from 'react';
export interface Town {
    id: string;
    name: string;
}

export interface District {
    id: string;
    name: string;
    towns: Town[];
}

export interface Province {
    id: string;
    name: string;
    districts: District[];
}

export const locations: Province[] = [
    {
        id: 'province-1',
        name: 'Province 1',
        districts: [
            {
                id: 'district-1',
                name: 'District 1',
                towns: [
                    { id: 'town-1', name: 'Town 1' },
                    { id: 'town-2', name: 'Town 2' },
                ],
            },
            {
                id: 'district-2',
                name: 'District 2',
                towns: [
                    { id: 'town-3', name: 'Town 3' },
                    { id: 'town-4', name: 'Town 4' },
                ],
            },
        ],
    },
    // Add more provinces as needed
];


const Dropdown = () => {
    const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
    const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

    return (
        <div className="relative">
            <div className="flex">
                <div className="w-48 bg-white shadow-md">
                    {locations.map((province) => (
                        <div
                            key={province.id}
                            className="p-2 hover:bg-gray-200"
                            onMouseEnter={() => setHoveredProvince(province)}
                            onMouseLeave={() => setHoveredProvince(null)}
                        >
                            {province.name}
                        </div>
                    ))}
                </div>
                {hoveredProvince && (
                    <div className="absolute left-48 top-0 w-48 bg-white shadow-md">
                        {hoveredProvince.districts.map((district) => (
                            <div
                                key={district.id}
                                className="p-2 hover:bg-gray-200"
                                onMouseEnter={() => setHoveredDistrict(district.id)}
                                onMouseLeave={() => setHoveredDistrict(null)}
                            >
                                {district.name}
                            </div>
                        ))}
                    </div>
                )}
                {hoveredDistrict && hoveredProvince && (
                    <div className="absolute left-96 top-0 w-48 bg-white shadow-md">
                        {hoveredProvince.districts
                            .find((d) => d.id === hoveredDistrict)
                            ?.towns.map((town) => (
                                <div key={town.id} className="p-2 hover:bg-gray-200">
                                    {town.name}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
