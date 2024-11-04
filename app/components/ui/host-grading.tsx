// components/HostGrading.tsx
'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMedal, faTrophy, faCrown } from '@fortawesome/free-solid-svg-icons';

interface HostGradingProps {
    propertiesListed: number;
}

const getGradingDetails = (propertiesListed: number) => {
    if (propertiesListed >= 31) {
        return { icon: faCrown, category: 'Expert', color: 'text-yellow-500' };
    } else if (propertiesListed >= 16) {
        return { icon: faTrophy, category: 'Advanced', color: 'text-blue-500' };
    } else if (propertiesListed >= 6) {
        return { icon: faMedal, category: 'Intermediate', color: 'text-green-500' };
    } else {
        return { icon: faStar, category: 'Rookie', color: 'text-gray-500' };
    }
};

const HostGrading: React.FC<HostGradingProps> = ({ propertiesListed }) => {
    const { icon, category, color } = getGradingDetails(propertiesListed);

    return (
        <>
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className={`h-6 w-6 ${color}`} />
                <span className="text-lg font-semibold">{category}</span>
            </div>
            <div className={`capitalize font-light bg-neutral-100 ${color} py-4 px-1 rounded-lg`}>
                An {category} host with {propertiesListed} career properties listed .
            </div>
        </>
    );
};

export default HostGrading;
