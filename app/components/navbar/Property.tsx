'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';

import useSearchModal from '@/app/hooks/useSearchModal';
import useCountries from '@/app/hooks/useCountries';
import { cn, formUrlQuery, removeKeysFromQuery } from '@/app/lib/utils';
import { categoryTypes } from '@/app/data';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IListingsParams } from '@/app/actions/getListings';

const Property = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [active, setActive] = useState('')

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

        setActive(category)
        router.push(newUrl, { scroll: false });
    }

    return (
        <div

            className="
        border-[1px] 
        w-full 
        md:w-auto 
        rounded-full 
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
          justify-center
       

        "
            >
                {categoryTypes.map((c, i) => (
                    <div
                        onClick={() => onSelectCategory(c.label)}
                        className={clsx(`
                    text-1xl 
                    font-light 
                    xs:px-2
                    sm:px-3
                    md-px-6 
                    py-2
                    border-x-[1px] 
                    flex-1 
                    text-center
                    hover:bg-neutral-100 
              transition
                  `, active === c.label && "bg-neutral-100")}
                    >
                        {c.label}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Property;