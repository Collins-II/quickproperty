"use client"

import React, { useRef, useState } from 'react';
import Container from '../Container';
import { ChevronDown } from 'lucide-react';
import { cn, formUrlQuery, removeKeysFromQuery } from '@/app/lib/utils';
import { District, Province, Town, provinces } from '@/app/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Dropdown: React.FC = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
    const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
    const [hoveredTown, setHoveredTown] = useState<Town | null>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseEnter = (province: Province) => {
        setHoveredProvince(province);
    };

    const handleMouseLeave = () => {
        setHoveredProvince(null);
    };

    const handleMouseDistrictEnter = (district: District) => {
        setHoveredDistrict(district);
    };

    const handleMouseDistrictLeave = () => {
        setHoveredDistrict(null);
    };

    const handleMouseTownEnter = (town: Town) => {
        setHoveredTown(town);
    };

    const handleMouseTownLeave = () => {
        setHoveredTown(null);
    };

    const onSelectCompound = (compound: string) => {
        let newUrl = '';

        if (compound) {
            newUrl = formUrlQuery({
                params: params?.toString(),
                key: 'compound',
                value: compound
            })
        } else {
            newUrl = removeKeysFromQuery({
                params: params?.toString(),
                keysToRemove: ['compound']
            })
        }

        router.push(newUrl, { scroll: false });
    }

    return (

        <div
            className="    
                    w-full 
                    h-full      
                    transition 
                    cursor-pointer
                    overflow-hidden
                    bg-white
                    max-w-[2520px]
        mx-auto
        xl:px-20 
        md:px-10
        sm:px-2
        px-4
                "
        >
            <div
                className="
                
                    block
                    xl:hidden
              bg-yellow-900
              text-white
               rounded-none
                    md:rounded-full 
                    shadow-sm 
                    hover:shadow-md 
              p-2
            absolute
            bottom-8
            lg:bottom-2
            left-0
            xl:left-3
            cursor-pointer
          "
            >
                <HiChevronLeft onClick={scrollLeft} />
            </div>
            <div
                ref={scrollContainerRef}
                className="
                        w-full
                        h-full
                        flex 
                        flex-row 
                        items-center 
                        justify-between
                        overflow-x-auto
                       hide-scroll-bar
                       lg:border-[1px]
                       rounded-full
                    "
            >
                {provinces.map((province) => (
                    <div
                        key={province.name}
                        className="w-full sm:py-1 md:py-2 hover:bg-white hover:text-slate-900 text-yellow-900 cursor-pointer border-r-[0.5px] border-neutral-200"
                        onMouseEnter={() => handleMouseEnter(province)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div
                            className="
                                    relative 
                                    cursor-pointer
                                    items-center
                                    flex
                                    flex-row
                                    justify-center
                                    gap-2
                                    px-5
                                    transition
                                    z-5
                                "
                        >
                            <span className='flex flex-row w-full text-sm font-semibold sm:text-xs md:text-sm lg:text-sm'>{province.name}</span>
                            <ChevronDown size={12} />
                        </div>
                        {hoveredProvince === province && (
                            <div className="absolute z-10 bg-white shadow-xl top-35 rounded-md mt-2">
                                {province.districts.map((district) => (
                                    <div
                                        key={district.name}
                                        className="relative px-4 py-2 hover:bg-gray-200 cursor-pointer "
                                        onMouseEnter={() => handleMouseDistrictEnter(district)}
                                        onMouseLeave={handleMouseDistrictLeave}
                                    >
                                        <span>{district.name}</span>
                                        {hoveredDistrict === district && (
                                            <div className={cn(`overflow-y-scroll absolute ${hoveredProvince && province.name === "N-Western" ? 'right-full' : 'left-full'} top-0 bg-white shadow-lg max-h-[300px] rounded-md showed-scroll-bar`)}>
                                                {district.compounds.map((town) => (
                                                    <div
                                                        onClick={() => onSelectCompound(town.name)}
                                                        key={town.name}
                                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer w-full"
                                                        onMouseEnter={() => handleMouseTownEnter(town)}
                                                        onMouseLeave={handleMouseTownLeave}
                                                    >
                                                        <span>{town.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div
                className="
                    block
                    xl:hidden
              bg-yellow-900
              text-white
              rounded-full
              p-2
            absolute
            bottom-8
            lg:bottom-2
            right-0
              xl:right-3
            cursor-pointer
          "
            >
                <HiChevronRight onClick={scrollRight} />
            </div>
        </div>
    );
};

export default Dropdown;
