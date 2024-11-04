"use client";
import { FC, useState } from 'react';
import { FaSwimmingPool, FaDumbbell, FaWifi, FaParking, FaSnowflake, FaDog, FaShieldAlt, FaTshirt, FaSpa, FaTableTennis } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

interface AmenitiesProps {
    amenities: string[];
}

const amenitiesIcons: { [key: string]: JSX.Element } = {
    'Swimming Pool': <FaSwimmingPool size={18} />,
    'Gym': <FaDumbbell size={18} />,
    'WiFi': <FaWifi size={18} />,
    'Parking': <FaParking size={18} />,
    'Air Conditioning': <FaSnowflake size={18} />,
    'Pet Friendly': <FaDog size={18} />,
    '24/7 Security': <FaShieldAlt size={18} />,
    'Laundry Service': <FaTshirt size={18} />,
    'Spa': <FaSpa size={18} />,
    'Tennis Court': <FaTableTennis size={18} />,
};

const Amenities: FC<AmenitiesProps> = ({ amenities }) => {
    const [showAll, setShowAll] = useState(false);

    const toggleShowAll = () => setShowAll(!showAll);

    // Limit description length for "See More" functionality
    const MAX_LENGTH = 6;

    const displayedAmenities = showAll ? amenities : amenities.slice(0, MAX_LENGTH);

    return (
        <>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 text-ellipsis bg-white translate">
                {displayedAmenities.map((amenity, index) => (
                    <div key={index} className="flex flex-col gap-2 items-center text-gray-700">
                        <div className='p-5 bg-neutral-100 text-blue-400 flex items-center justify-center rounded-full'>{amenitiesIcons[amenity]}</div>
                        <span className='text-xs font-semibold text-slate-700'>{amenity}</span>
                    </div>
                ))}
            </div>
            {/* Toggle button for See More / See Less */}
            {amenities.length > MAX_LENGTH && (
                <button
                    onClick={toggleShowAll}
                    className="text-slate-500 font-semibold hover:underline"
                >
                    {showAll ? "See Less" : "See More"}
                </button>
            )}
        </>
    );
};

export default Amenities;
