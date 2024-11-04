'use client';

import dynamic from "next/dynamic";
import { IconType } from "react-icons";

import useCountries from "@/app/hooks/useCountries";
import { CreateUserParams, SafeListing, SafeUser } from "@/app/types";

import Calendar from "../inputs/Calendar";
import ListingCategory from "./ListingCategory";
import Amenities from "../AmenitiesList";
import { useRouter } from "next/navigation";
import ShareLinks from "./ShareLinks";
import HeartButton from "../HeartButton";
import PropertySave from "../ui/property-save";
import { Range } from "react-date-range";
import { IListing } from "@/app/lib/database/models/listing.model";
import { amenitiesOpts, propertyReviews } from "@/app/data";
import ListingDescription from "./ListingDescription";
import PropertyReview from "./PropertyReview";

interface ListingInfoProps {
  user: CreateUserParams,
  listingId: string;
  data: IListing;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  amenities: string[];
  onChangeDate: (value: Range) => void;
  dateRange: Range,
  disabledDates?: Date[];
  category: {
    icon: IconType,
    label: string;
    description: string;
  } | undefined
  property_type: string;
  locationValue: string;
}

const Map = dynamic(() => import('../Map'), {
  ssr: false
});

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  listingId,
  data,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  onChangeDate,
  dateRange,
  disabledDates,
  property_type,
  category,
  amenities,
  locationValue,
}) => {
  const router = useRouter()
  const url = 'https://yourpropertylisting.com/property/12345';
  const title = 'Check out this amazing property!';

  const handleProfile = () => {
    router.push(`/profile/${user._id}`)
  }

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ShareLinks listingId={listingId} currentUser={user as SafeUser} data={data} />
        <hr />
        <div className="text-1xl md:text-2xl font-semibold mt-5">
          ZMW {5467}
        </div>
        <div className="
            flex 
            flex-row 
            items-center 
            gap-4 
           
          "
        >

          <div className="flex flex-row gap-1">
            <p className="font-bold text-1xl md:text-2xl text-slate-900">{roomCount} <span className=" font-light text-neutral-500">rooms</span> </p>
          </div>
          <div className="flex flex-row gap-1">
            <p className="font-bold text-1xl md:text-2xl text-slate-900">{bathroomCount} <span className=" font-light text-neutral-500">{bathroomCount > 1 ? "bathrooms" : "bathroom"}</span></p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          {category && (
            <ListingCategory
              icon={category.icon}
              label={category?.label}
              description={category?.description}
            />
          )}
        </div>
        <hr />
        {/* <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) =>
            onChangeDate(value.selection)}
        />
        */}
        <div className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div className="flex flex-row gap-2">
            <p className="font-bold text-1xl md:text-2xl text-slate-900">{35}</p> Sq Ft
          </div>
        </div>
        <p className="font-bold text-2xl md:text-3xl text-slate-900 mt-4">Overview</p>
        <ListingDescription description="Set on a tree-lined street, this Marina-style condo spans the entire top floor w/ 2 bedrooms, large bonus room, deck, yard & pkg. This sun-drenched home is perfectly oriented, w/ morning sun gently waking you in the eastern-facing bedrooms & filling the western-facing living room with light in the evening. Through the foyer you are greeted by colorful stained glass window & intricate period details. At one end of the hall the large, bright living room w/ decorative FP set between built-ins, & lrg bay window. Continuing through the formal dining room, you'll find the renovated eat-in kitchen w/ new ss appliances, custom cabinetry & an abundance of light." />
      </div>

      <hr />
      <p className="font-bold text-2xl md:text-3xl text-slate-900 ">Facilities</p>
      {amenitiesOpts && (<Amenities amenities={amenitiesOpts} />)}
    </div>
  );
}

export default ListingInfo;