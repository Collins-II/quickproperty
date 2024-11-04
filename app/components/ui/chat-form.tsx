'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from "react";

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import useReservationModal from "@/app/hooks/useReservationModal";
import Heading from '../Heading';
import Input from '../inputs/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { ConversationType, CreateUserParams } from '@/app/types';
import axios from 'axios';
import socket from '../../lib/socket.io';
import getListingById from '@/app/actions/getListingById';
import { IParams } from '@/app/listings/[listingId]/page';
import { IListing } from '@/app/lib/database/models/listing.model';
import { IConversation } from '@/app/lib/database/models/conversation.model';
import { IUser } from '@/app/lib/database/models/user.model';
import { HiPaperAirplane } from 'react-icons/hi';

interface listingType {
    listing: IListing & {
        user: CreateUserParams;
    };
}

interface ChatBoxProps {
    conversation: IConversation & {
        users: IUser[],
        listing: IListing
    }
}

const ChatForm = ({ params }: { params: IParams }) => {
    const router = useRouter();
    const reservationModal = useReservationModal();
    const propertyUserId = reservationModal.propertyUserId;

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {
            phoneNumber: 1,
            message: ''
        }
    });

    const message = watch('message');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setValue('message', '', { shouldValidate: true })
        axios.post('/api/message', { ...data, });
    };

    /*const actionLabel = useMemo(() => {
      if (step === STEPS.INFO) {
        return 'Reservation';
      }
      return 'Process Payment';
    }, [step]);
  
    const secondaryActionLabel = useMemo(() => {
      if (step === STEPS.LOCATION) {
        return undefined;
      }
      return 'Back';
    }, [step]);*/


    return (
        <div className="flex flex-col gap-8">
            <form onClick={handleSubmit(onSubmit)}
                className='w-full flex items-center gap-2'
            >
                <Input
                    id="message"
                    label="Write a message"
                    formatPrice
                    type="text"
                    register={register}
                    errors={errors}
                    required
                />
                <button
                    type='submit'
                    className='
                bg-sky-500
                hover:bg-sky-600
                transition
                rounded-full
                p-2
                cursor-pointer
                '
                >
                    <HiPaperAirplane size={18} className='text-white' />
                </button>
            </form>
        </div>
    );
};

export default ChatForm;
