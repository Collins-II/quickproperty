"use client";

import Image from 'next/image';
import Heading from '../Heading';
import PhoneInput from '../inputs/InputNumber';
import { FieldValues, useForm } from 'react-hook-form';
import { IListing } from '@/app/lib/database/models/listing.model';
import { listingType } from '../modals/ReservationModal';
import { useCallback, useEffect, useMemo, useState } from "react";

interface PaymentPageProps {
    price: number;
    listing: listingType;
    isLoading: boolean;
    onSubmit: () => void;
    register: ReturnType<typeof useForm>['register'];
    errors: ReturnType<typeof useForm>['formState']['errors'];
}

const PaymentPage = ({ price, listing, isLoading, register, onSubmit, errors }: PaymentPageProps) => {

    const handleSubmit = useCallback(() => {
        if (isLoading) {
            return;
        }

        onSubmit();
    }, [onSubmit, isLoading]);

    return (
        <div className="flex flex-col max-w-3xl mx-auto bg-white rounded-lg ">
            <Heading title="Reservation Fee Payment" subtitle="Note: The transaction is irreversible!" />

            <div className='w-full h-auto flex justify-center items-center py-8 bg-yellow-300 rounded-md shadow-lg mb-8'>
                <Image alt="mtn_logo" src="/images/mtn1.png" width={140} height={140} className='object-cover rounded-md' />
            </div>

            <div className="bg-gray-100 p-4 rounded-md mb-2">
                <div className="flex gap-3 w-full total">
                    <h3>Total Price:</h3>
                    <h3>K {price}</h3>
                </div>
                <PhoneInput
                    id="phoneNumber"
                    label="Enter phone"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
            <button
                className="mt-8 w-full bg-red-500 text-white p-4 rounded-full shadow-md hover:bg-red-600 transition"
                disabled={isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default PaymentPage;
