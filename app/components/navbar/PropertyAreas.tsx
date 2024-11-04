'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useCountries from '@/app/hooks/useCountries';
import { formUrlQuery, removeKeysFromQuery } from '@/app/lib/utils';

const PropertyAreas = () => {
    const params = useSearchParams();
    const router = useRouter();
    const { getByValue } = useCountries();

    const locationValue = params?.get('locationValue');
    const startDate = params?.get('startDate');
    const endDate = params?.get('endDate');
    const guestCount = params?.get('guestCount');

    const locationLabel = useMemo(() => {
        if (locationValue) {
            return getByValue(locationValue as string)?.label;
        }

        return 'Anywhere';
    }, [locationValue, getByValue]);

    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} Days`;
        }

        return 'Any Week'
    }, [startDate, endDate]);

    const guestLabel = useMemo(() => {
        if (guestCount) {
            return `${guestCount} Guests`;
        }

        return 'Add Guests';
    }, [guestCount]);

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

    return (
        <div

            className="
        border-[1px] 
        w-full 
        md:w-auto 
        rounded-sm 
        shadow-sm 
        hover:shadow-md 
        transition 
        cursor-pointer
        overflow-hidden
      "
        >
            <div
                className="
          flex 
          flex-row 
          items-center 
          justify-between

        "
            >
                <div
                    onClick={() => onSelectCategory("Low Cost")}
                    className="
                    hover:bg-neutral-100 
      transition
            text-sm 
            font-semibold 
            px-6
            py-2
          "
                >
                    Low Cost
                </div>
                <div
                    onClick={() => onSelectCategory("Medium Cost")}
                    className="
            hidden 
            sm:block 
            text-sm 
            font-semibold 
            px-6 
            py-2
            border-x-[1px] 
            flex-1 
            text-center
            hover:bg-neutral-100 
      transition
          "
                >
                    Medium Cost
                </div>
                <div
                    onClick={() => onSelectCategory("High Cost")}
                    className="
            hidden 
            sm:block 
            text-sm 
            font-semibold 
            px-6 
            py-2
            border-x-[1px] 
            flex-1 
            text-center
            hover:bg-neutral-100 
      transition
          ">High Cost</div>

            </div>
        </div>
    );
}

export default PropertyAreas;