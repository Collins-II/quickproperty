import React, { useContext, useRef } from 'react';
import BusinessItem from './BusinessItem';
import { useSelectedBusiness } from '../../context/SelectedBusinessContext';
import { IListing } from '@/app/lib/database/models/listing.model';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface Business {
  id: number;
  name: string;
  geometry: any; // Replace `any` with the specific type
  formatted_address: string;
  rating: number;
  [key: string]: any;
}

interface BusinessListProps {
  businessList: IListing[];
}

const BusinessList: React.FC<BusinessListProps> = ({ businessList }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const context = useSelectedBusiness();

  if (!context) {
    throw new Error("SelectedBusinessContext must be used within a SelectedBusinessProvider");
  }

  const { selectedBusiness, setSelectedBusiness } = context;


  const scrollLeft = () => {
    if (elementRef.current) {
        elementRef.current.scrollBy({
            left: -200,
            behavior: 'smooth',
        });
    }
};

const scrollRight = () => {
    if (elementRef.current) {
        elementRef.current.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    }
};

  return (
    <div className="relative flex items-center ">
    <div
        ref={elementRef}
        className="
            flex flex-row
            gap-3
            overflow-x-auto
            hide-scroll-bar
            pr-2
            mb-4
            w-full
            scroll-smooth
            translate
    duration-600
        "
    >
        {businessList.map((item) => (
          <div key={item.id} onClick={() => setSelectedBusiness(item)}>
            <BusinessItem business={item} />
          </div>
        ))}
      </div>
            <div
                className="
              bg-white
              text-yellow-900
              shadow-lg
              rounded-full
              p-2
            absolute
            bottom-[50%]
            left-0
            cursor-pointer
          "
            >
                <HiChevronLeft onClick={scrollLeft} />
            </div>
            <div
                className="
              bg-white
              text-yellow-900
              shadow-lg
              rounded-full
              p-2
            absolute
            bottom-[50%]
            right-0
            cursor-pointer
          "
            >
                <HiChevronRight onClick={scrollRight} />
            </div>
        </div>
  );
};

export default BusinessList;
