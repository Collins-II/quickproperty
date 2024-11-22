"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next-nprogress-bar';
import Markers from './Home/Markers';
import { IListing } from '../lib/database/models/listing.model';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface Property {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

interface MapProps {
    userLocation?: number[];
    properties: IListing[];
}

const Map: React.FC<MapProps> = ({ userLocation, properties }) => {
    const router = useRouter();
    const { data: session } = useSession()
    const currentUser = session?.user;

    const handleClick = () => {
        router.push("/listing/2")
    }
    // Ensure userLocation is a valid LatLngExpression
    const defaultPosition: L.LatLngExpression = Array.isArray(userLocation) && userLocation.length === 2
        ? userLocation as [number, number]
        : [-15.40, 28.31];

    return (
        <MapContainer
            center={defaultPosition}
            zoom={userLocation ? 12 : 10}
            scrollWheelZoom={true}
            className="h-[60vh] rounded-md"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* User Location Marker */}
            {userLocation && (
                <Marker position={defaultPosition}>
                    <Popup>
                        <Image src={currentUser?.image as string} alt='profile' height={30} width={30} className='rounded-full' />
                    </Popup>
                </Marker>
            )}

            {/* Property Markers */}
            {properties.map(
            (item, index) =>
              index <= 7 && (<Marker position={[item.location.lat,item.location.lng]}>
                               <Popup>
                                 <Markers business={item} key={item.id || index} />
                               </Popup>
                            </Marker>) 
          )}
        </MapContainer>
    );
};

export default Map;
