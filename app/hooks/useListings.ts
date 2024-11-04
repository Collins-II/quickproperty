"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IListing } from '../lib/database/models/listing.model';
import getListings, { IListingsParams } from '../actions/getListings';

interface HomeProps {
    searchParams: IListingsParams
};

const useListings = ({ searchParams }: HomeProps) => {
    const [listings, setListings] = useState<IListing[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getListings({ ...searchParams, isReserved: true }); //axios.get(`/api/listings?page=${page}`);
            console.log('AUTO listings:', response);
            setListings(prevListings => [...prevListings, ...response]);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    return { listings, loading, setPage };
};

export default useListings;
