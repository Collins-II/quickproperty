import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useUserLocation } from "../../context/UserLocationContext";
import { IListing } from "@/app/lib/database/models/listing.model";
import { useRouter } from "next-nprogress-bar";

type Business = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: { photo_reference: string }[];
  name: string;
  formatted_address: string;
  rating: number;
};

interface BusinessItemProps {
  business: IListing;
  showDir?: boolean;
}

function BusinessItem({ business, showDir = false }: BusinessItemProps) {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";
  const photoRef = business?.imageSrc ? business?.imageSrc[0]: "";
  const context = useUserLocation();
  const { userLocation } = context;
  const router = useRouter();

  const [distance, setDistance] = useState<string | undefined>();

  useEffect(() => {
    calculateDistance(
      business.location?.lat as number,
      business.location?.lng as number,
      userLocation.lat,
      userLocation.lng
    );
  }, [business.location, userLocation]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const earthRadius = 6371; // in kilometers

    const degToRad = (deg: number): number => {
      return deg * (Math.PI / 180);
    };

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const calculatedDistance = earthRadius * c;

    const distanceInMiles = calculatedDistance * 0.621371; // Convert km to miles
    setDistance(distanceInMiles.toFixed(1));
    return distanceInMiles.toFixed(2); // Return the distance with 2 decimal places
  };

  const onDirectionClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${business.location?.lat},${business.location?.lng}&travelmode=driving`
    );
  };

  const onView = () =>{
     router.push(`/listings/${business._id}`)
  };


  return (
    <div
      className="w-[195px] flex-shrink-0 p-2
     rounded-lg shadow-md mb-1
     bg-white hover:scale-110 transition-all mt-[20px] cursor-pointer"
     onClick={onView}
    >
      <Image
        src={business.imageSrc[0]}
        alt={business.title as string}
        width={180}
        height={80}
        className="rounded-lg object-cover h-[90px]"
      />
      <h2 className="text-[13px] font-bold mt-1 line-clamp-1">{business.title}</h2>
      <h2 className="text-[10px] text-gray-400 line-clamp-2">{business.area}</h2>
      <div className="flex gap-1 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3 h-3 text-yellow-500"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-[10px] font-bold">{business.property_type}</h2>
      </div>
      {showDir ? (
        <div className="border-t-[1px] p-1 mt-1">
          <h2 className="text-[#0075ff] flex justify-between items-center">
            Dist: {distance} Miles
            <span
              className="border-[1px] p-1 rounded-full border-blue-500 hover:text-white hover:bg-blue-500"
              onClick={() => onDirectionClick()}
            >
              Get Direction
            </span>
          </h2>
        </div>
      ) : null}
    </div>
  );
}

export default BusinessItem;
