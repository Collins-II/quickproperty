'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import CategoryInput from '@/app/components/inputs/CategoryInput';
import { cn, formUrlQuery, removeKeysFromQuery } from '@/app/lib/utils';
import { categories } from './navbar/Categories';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import PropertyInput from './inputs/PropertyInput';
import { useRouter } from 'next-nprogress-bar';

const PropertyFilter = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [active, setActive] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const onSelectCategory = (category: string) => {
        let newUrl = '';

        if (category) {
            newUrl = formUrlQuery({
                params: params?.toString(),
                key: 'property_type',
                value: category
            });
            setActive(category);
        } else {
            newUrl = removeKeysFromQuery({
                params: params?.toString(),
                keysToRemove: ['property_type']
            });
            !category && setActive('');
        }

        router.push(newUrl, { scroll: false });
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -200,
                behavior: 'smooth',
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

    return (
        <div className="relative flex items-center ">
            <div
                ref={scrollContainerRef}
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
                {categories.map((item) => (
                    <div key={item.label} className="col-span-1 py-2">
                        <PropertyInput
                            onClick={() => onSelectCategory(item.label)}
                            selected={active === item.label}
                            label={item.label}
                            icon={item.icon}
                        />
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
}

export default PropertyFilter;
