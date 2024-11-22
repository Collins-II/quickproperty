"use client";

import GlobalApi from "../Shared/GlobalApi";
import BusinessList from "../components/Home/BusinessList";
import CategoryList from "../components/Home/CategoryList";
import GoogleMapView from "../components/Home/GoogleMapView";
import RangeSelect from "../components/Home/RangeSelect";
import SelectRating from "../components/Home/SelectRating";
import SkeltonLoading from "../components/SkeltonLoading";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Business } from "../types";
import { useUserLocation } from "../context/UserLocationContext";
import NearProperty from "./near-property";
import { IListing } from "../lib/database/models/listing.model";

// Define the type for a category
type Category = string;

// Define the type for user location
interface UserLocation {
  lat: number;
  lng: number;
}

interface FindProps {
  listings: IListing[]
}

export default function FinderProperty({listings}:FindProps) {
  const { data: session } = useSession();
  const [category, setCategory] = useState<Category | undefined>();
  const [radius, setRadius] = useState<number>(2500);
  const [businessList, setBusinessList] = useState<IListing[]>(listings);
  const [businessListOrg, setBusinessListOrg] = useState<IListing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const context = useUserLocation();
  const { userLocation } = context
 
  useEffect(() => {
    if (!session?.user) {
      router.push("/Login");
    }
  }, [session, router]);

{/*useEffect(() => {
    getGooglePlace();
  }, [category, radius])

  const getGooglePlace = async () => {
    if (category) {
      setLoading(true);

      try {
        const resp = await GlobalApi.getGooglePlace(category, radius, userLocation.lat, userLocation.lng);
        setBusinessList(resp.data.product.results);
        setBusinessListOrg(resp.data.product.results);
      } finally {
        setLoading(false);
      }
    }
  };

  const onRatingChange = (ratings: number[]) => {
    if (ratings.length === 0) {
      setBusinessList(businessListOrg);
      return;
    }

    const result = businessListOrg.filter((item) =>
      ratings.some((rating) => item.rating >= rating)
    );

    setBusinessList(result);
  };*/}

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 overflow-y-scroll">
      <div className="p-3">
        <CategoryList onCategoryChange={(value: Category) => setCategory(value)} />
        <RangeSelect onRadiusChange={(value: number) => setRadius(value)} />
         {/*<SelectRating onRatingChange={(value: number[]) => onRatingChange(value)} />*/}
      </div>
      <div className="relative col-span-3">
         <NearProperty data={listings}/>
       {/*<GoogleMapView businessList={businessList} /> */}
        <div className="md:absolute mx-2 w-[90%] bottom-36 md:bottom-3">
          {!loading ? (
            <BusinessList businessList={businessList} />
          ) : (
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <SkeltonLoading key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
