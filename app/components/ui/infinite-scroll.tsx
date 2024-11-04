"use client";
// components/InfiniteScroll.tsx
import React, { useRef, useEffect } from 'react';
import useListings from '@/app/hooks/useListings';
import { IListingsParams } from '@/app/actions/getListings';
import ListingCard from '../listings/ListingCard';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface ScrollProps {
    searchParams: IListingsParams
}

const InfiniteScroll: React.FC<ScrollProps> = ({ searchParams }) => {
    const { listings, loading, setPage } = useListings({ searchParams });
    const { data: session } = useSession()
    const currentUser = session?.user
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, setPage]);

    return (
        <div>
            <div className="listings">
                {listings.map(listing => (
                    <Image src={listing.imageSrc[0]} alt="property" width={40} height={40} />
                ))}
            </div>
            <div ref={loaderRef} className="loader">
                {loading && <p>Loading...</p>}
            </div>
        </div>
    );
};

export default InfiniteScroll;
