"use client";
import { useEffect, useState } from 'react';
import Map from '../components/near-map';

interface Property {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

const fetchPropertiesNearby = async (lat: number, lng: number): Promise<Property[]> => {
    // Mock API call
    return [
        { id: 1, name: 'Property 1', lat: lat + 0.01, lng: lng + 0.01 },
        { id: 2, name: 'Property 2', lat: lat + 0.02, lng: lng - 0.01 },
        { id: 3, name: 'Property 3', lat: lat - 0.01, lng: lng + 0.02 },
    ];
};

const NearProperty: React.FC = () => {
    const [userLocation, setUserLocation] = useState<number[] | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);

                    // Fetch nearby properties based on user's location
                    const nearbyProperties = await fetchPropertiesNearby(latitude, longitude);
                    setProperties(nearbyProperties);
                },
                (error) => {
                    console.error('Error fetching user location:', error);
                }
            );
        }
    }, []);

    return (
        <div className=''>
            <Map userLocation={userLocation || undefined} properties={properties} />
        </div>
    );
};

export default NearProperty;
