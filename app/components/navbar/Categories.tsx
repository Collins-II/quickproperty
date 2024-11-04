'use client';

import React, { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TbBeach, TbBrandBooking, TbBuildingCommunity, TbContainer, TbMountain, TbPool } from 'react-icons/tb';
import {
  GiAppleMaggot,
  GiBarn,
  GiBaseDome,
  GiBoatFishing,
  GiBuoy,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiCow,
  GiCrackedAlienSkull,
  GiCultist,
  GiFactory,
  GiFamilyHouse,
  GiFarmTractor,
  GiFarmer,
  GiFlake,
  GiForest,
  GiForestCamp,
  GiGrapes,
  GiHorseHead,
  GiHorseshoe,
  GiHunterEyes,
  GiIgloo,
  GiIsland,
  GiMountainCave,
  GiPlantWatering,
  GiShipWheel,
  GiSmallFire,
  GiTombstone,
  GiTreehouse,
  GiUndergroundCave,
  GiWheat,
  GiWindmill,
  GiWoodCabin
} from 'react-icons/gi';
import { FaBabyCarriage, FaBed, FaBuilding, FaHotel, FaIndustry, FaSkiing, FaWarehouse } from 'react-icons/fa';
import { BsBuildingsFill, BsMenuDown, BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdBungalow, MdCottage, MdHouseboat, MdOutlineVilla, MdStadium } from 'react-icons/md';

import CategoryBox from "../CategoryBox";
import Container from '../Container';
import PropertyAreas from './PropertyAreas';
import { GiBeachBall } from 'react-icons/gi';
import {
  FaChurch,
  FaMosque,
  FaSynagogue,
  FaDumbbell,
  FaCar,
  FaLandmark,
  FaCity,
  FaShoppingBag,
  FaHandHoldingUsd,
  FaUniversity,
  FaHospitalAlt,
  FaHome,
  FaTree,
  FaMountain,
  FaWater,
  FaRoad,
  FaStore,
  FaHospital,
  FaSchool,
  FaPlaceOfWorship,
} from 'react-icons/fa';
import { FcDam } from 'react-icons/fc';
import { AiOutlineMenu } from 'react-icons/ai';
import { formUrlQuery, removeKeysFromQuery } from '@/app/lib/utils';
import LocationDropdown from "../ui/location-dropdown";

export const listingCategories = [
  {
    label: 'Single',
    icon: FaHome,
    description: 'This property is a single-family home.',
  },
  {
    label: 'Condominium',
    icon: FaBuilding,
    description: 'This property is a condominium (condo).',
  },
  {
    label: 'Townhouse',
    icon: FaBuilding,
    description: 'This property is a townhouse.',
  },
  {
    label: 'Apartment',
    icon: FaBuilding,
    description: 'This property is an apartment.',
  },
  {
    label: 'Duplex',
    icon: FaBuilding,
    description: 'This property is a duplex.',
  },
  {
    label: 'Triplex',
    icon: FaBuilding,
    description: 'This property is a triplex.',
  },
  {
    label: 'Quadruplex',
    icon: FaBuilding,
    description: 'This property is a quadruplex.',
  },
  {
    label: 'Family',
    icon: FaBuilding,
    description: 'This property is a multi-family home.',
  },
  {
    label: 'Villa',
    icon: FaBuilding,
    description: 'This property is a villa.',
  },
  {
    label: 'Bungalow',
    icon: FaBuilding,
    description: 'This property is a bungalow.',
  },
  {
    label: 'Mansion',
    icon: FaBuilding,
    description: 'This property is a mansion.',
  },
  {
    label: 'Cottage',
    icon: FaBuilding,
    description: 'This property is a cottage.',
  },
  {
    label: 'Penthouse',
    icon: FaBuilding,
    description: 'This property is a penthouse.',
  },
  {
    label: 'Studio',
    icon: FaBuilding,
    description: 'This property is a studio apartment.',
  },
  {
    label: 'Loft',
    icon: FaBuilding,
    description: 'This property is a loft.',
  },
  {
    label: 'Mobile',
    icon: FaBuilding,
    description: 'This property is a mobile home.',
  },
  {
    label: 'Farmhouse',
    icon: FaBuilding,
    description: 'This property is a farmhouse.',
  },
  {
    label: 'Log Cabin',
    icon: FaBuilding,
    description: 'This property is a log cabin.',
  },

];

export const categories = [
  {
    label: 'Single',
    icon: '/images/est_2.jpg',
    description: 'This property is a single-family home.',
  },
  {
    label: 'Condominium',
    icon: '/images/est_2.jpg',
    description: 'This property is a condominium (condo).',
  },
  {
    label: 'Townhouse',
    icon: '/images/est_2.jpg',
    description: 'This property is a townhouse.',
  },
  {
    label: 'Apartment',
    icon: '/images/est_2.jpg',
    description: 'This property is an apartment.',
  },
  {
    label: 'Duplex',
    icon: '/images/est_2.jpg',
    description: 'This property is a duplex.',
  },
  {
    label: 'Triplex',
    icon: '/images/est_2.jpg',
    description: 'This property is a triplex.',
  },
  {
    label: 'Quadruplex',
    icon: '/images/est_2.jpg',
    description: 'This property is a quadruplex.',
  },
  {
    label: 'Family',
    icon: '/images/est_2.jpg',
    description: 'This property is a multi-family home.',
  },
  {
    label: 'Villa',
    icon: '/images/est_2.jpg',
    description: 'This property is a villa.',
  },
  {
    label: 'Bungalow',
    icon: '/images/est_2.jpg',
    description: 'This property is a bungalow.',
  },
  {
    label: 'Mansion',
    icon: '/images/est_2.jpg',
    description: 'This property is a mansion.',
  },
  {
    label: 'Cottage',
    icon: '/images/est_2.jpg',
    description: 'This property is a cottage.',
  },
  {
    label: 'Penthouse',
    icon: '/images/est_2.jpg',
    description: 'This property is a penthouse.',
  },
  {
    label: 'Studio',
    icon: '/images/est_2.jpg',
    description: 'This property is a studio apartment.',
  },
  {
    label: 'Loft',
    icon: '/images/est_2.jpg',
    description: 'This property is a loft.',
  },
  {
    label: 'Mobile',
    icon: '/images/est_2.jpg',
    description: 'This property is a mobile home.',
  },
  {
    label: 'Farmhouse',
    icon: '/images/est_2.jpg',
    description: 'This property is a farmhouse.',
  },
  {
    label: 'Log Cabin',
    icon: '/images/est_2.jpg',
    description: 'This property is a log cabin.',
  },

];

export const listingTypes = [
  /*{
    label: 'Booking',
    icon: MdStadium,
    description: 'This property is listed for bookings!',
  },*/
  {
    label: 'Rental',
    icon: FaLandmark,
    description: 'This property is listed for renting!',
  },
  {
    label: 'Sale',
    icon: FaBuilding,
    description: 'This property is listed for sale!'
  },
]


export const provinceTypes = [
  {
    label: 'Lusaka',
    icon: AiOutlineMenu,
    description: 'This property is listed for bookings!',
  },
  {
    label: 'Copperbelt',
    icon: AiOutlineMenu,
    description: 'This property is listed for renting!',
  },
  {
    label: 'Western',
    icon: AiOutlineMenu,
    description: 'This property is listed for sale!'
  },
  {
    label: 'Eastern',
    icon: AiOutlineMenu,
    description: 'This property is listed for bookings!',
  },
  {
    label: 'Southern',
    icon: AiOutlineMenu,
    description: 'This property is listed for renting!',
  },
  {
    label: 'Northern',
    icon: AiOutlineMenu,
    description: 'This property is listed for sale!'
  },
  {
    label: 'Luapula',
    icon: AiOutlineMenu,
    description: 'This property is listed for sale!'
  },
  {
    label: 'Muchinga',
    icon: AiOutlineMenu,
    description: 'This property is listed for bookings!',
  },
  {
    label: 'North-Western',
    icon: AiOutlineMenu,
    description: 'This property is listed for renting!',
  },
  {
    label: 'Central',
    icon: AiOutlineMenu,
    description: 'This property is listed for sale!'
  },
]
import { Location, provinces, districts, towns } from '../../data';
import MenuItem from "./MenuItem";
import Dropdown from "../ui/dropdown";

const Categories = () => {
  const params = useSearchParams();
  const router = useRouter();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null);
  const [selectedTown, setSelectedTown] = useState<Location | null>(null);

  const handleProvinceSelect = (province: Location) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedTown(null);
  };

  const handleDistrictSelect = (district: Location) => {
    setSelectedDistrict(district);
    setSelectedTown(null);
  };

  const handleTownSelect = (town: Location) => {
    setSelectedTown(town);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onSelectCategory = (category: string) => {
    let newUrl = '';

    if (category) {
      newUrl = formUrlQuery({
        params: params?.toString(),
        key: 'category',
        value: category
      })
    } else {
      newUrl = removeKeysFromQuery({
        params: params?.toString(),
        keysToRemove: ['category']
      })
    }

    router.push(newUrl, { scroll: false });
  }

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div

        className="
lg:border-[1px] 
w-full 
h-full
md:w-auto 
rounded-full 
shadow-sm 
hover:shadow-md 
transition 
cursor-pointer
"
      >
        <div
          className="
flex 
flex-row 
items-center 
justify-between
overflow-x-auto
showed-scroll-bar
"
        >
          <Dropdown />
          {/*{provinceTypes.map((item) => (
            <div
              onClick={toggleOpen}
              className="
   
   px-6 
   pt-2
   border-x-[1px]
   items-center
   w-auto
   flex-1 
   flex
   flex-row
   gap-2
   text-center
   hover:bg-neutral-100 
transition
 "
            >
              <p className='flex flex-row w-full text-sm font-semibold'>{item.label}</p>
              <item.icon size={12} />
            </div>
          ))}
        </div>
        {/*<div>
          <h1>Zambia Location Dropdown</h1>
          <LocationDropdown label="Province" options={provinces} onSelect={handleProvinceSelect} />
          {selectedProvince && (
            <LocationDropdown label="District" options={districts} onSelect={handleDistrictSelect} />
          )}
          {selectedDistrict && (
            <LocationDropdown label="Town" options={towns} onSelect={handleTownSelect} />
          )}
          <div>
            <h2>Selected Locations:</h2>
            <p>Province: {selectedProvince?.name || '-'}</p>
            <p>District: {selectedDistrict?.name || '-'}</p>
            <p>Town: {selectedTown?.name || '-'}</p>
          </div>
        </div>*/}
          {isOpen && (
            <div
              className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
          w-auto
            bg-white 
            overflow-hidden 
            top-12 
            text-sm
          "
            >
              <div className="flex flex-col cursor-pointer">
                <MenuItem
                  label="My trips"
                  onClick={() => router.push('/trips')}
                />
                <MenuItem
                  label="My favorites"
                  onClick={() => router.push('/favorites')}
                />
                <MenuItem
                  label="My reservations"
                  onClick={() => router.push('/reservations')}
                />
                <MenuItem
                  label="My properties"
                  onClick={() => router.push('/properties')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Categories;