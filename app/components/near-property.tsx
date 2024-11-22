"use client";
import { useEffect, useState } from 'react';
import Map from '../components/near-map';
import { IListing } from '../lib/database/models/listing.model';

interface PropertyData {
    data: IListing[];
}

const NearProperty: React.FC<PropertyData> = ({ data }) => {
    const [userLocation, setUserLocation] = useState<number[] | null>(null);
    const [properties, setProperties] = useState<IListing[]>([]);

    /**
     * Calculates the distance between two geographical points using the Haversine formula.
     * @param lat1 Latitude of the first location
     * @param lng1 Longitude of the first location
     * @param lat2 Latitude of the second location
     * @param lng2 Longitude of the second location
     * @returns Distance in kilometers
     */
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const toRadians = (degrees: number) => degrees * (Math.PI / 180);
        const R = 6371; // Radius of Earth in kilometers

        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    /**
     * Filters properties near the user's current district or compound location.
     * @param lat User's latitude
     * @param lng User's longitude
     * @param maxDistance Maximum distance (in kilometers) to filter properties
     * @returns Array of nearby properties
     */
    const fetchPropertiesNearby = async (lat: number, lng: number, maxDistance: number = 10): Promise<IListing[]> => {
        return data.filter((property) => {
            const distance = calculateDistance(lat, lng, property.location.lat, property.location.lng);
            return distance <= maxDistance;
        });
    };

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
        <div className="">
            <Map userLocation={userLocation || undefined} properties={properties} />
        </div>
    );
};

export default NearProperty;
