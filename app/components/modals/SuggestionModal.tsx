'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';
import { useRouter } from "next-nprogress-bar";

import useReservationModal from "@/app/hooks/useReservationModal";

import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from '../Heading';
import Input from '../inputs/Input';
import { FieldValues, useForm } from 'react-hook-form';
import PhoneInput from '../inputs/InputNumber';
import { listingTypes } from '../navbar/Categories';
import { networkTypes } from '@/app/data';
import Chat from '../Chat';
import { useSession } from 'next-auth/react';
import ChatBox from '../ChatBox';
import getConversationById from '@/app/actions/getConversationById';
import { CreateUserParams } from '@/app/types';
import axios from 'axios';
import socket from '../../lib/socket.io';
import getListingById from '@/app/actions/getListingById';
import { IParams } from '@/app/listings/[listingId]/page';
import { IListing } from '@/app/lib/database/models/listing.model';
import { IConversation } from '@/app/lib/database/models/conversation.model';
import { IUser } from '@/app/lib/database/models/user.model';
import ChatHome from '../chat/chat';
import ChatId from '../chat/chatId/chat-id';
import PaymentForm from '../ui/paymentForm';
import PaymentButton from '../ui/paymentBotton';
import { registerIPN } from '@/app/lib/payment.server';
import { createMtnApiUser } from '@/app/lib/mtn.apis';
import Image from 'next/image';
import PaymentPage from '../ui/paymentForm';
import PaymentSuccess from '../ui/paymentSuccess';
import Link from 'next/link';
import ModalSuggestion from './ModalSuggest';
import useSuggestionModal from '@/app/hooks/useSuggestionModal';
import { toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

enum STEPS {
  INFO = 0,
  SUCCESS = 1,
}

export interface listingType {
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

const SuggestionModal = () => {
  const { data: session } = useSession();
  const user = session?.user
  const currentPath = usePathname();
  const router = useRouter();
  const reservationModal = useSuggestionModal();

  const [step, setStep] = useState(STEPS.INFO);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<CountrySelectValue>();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    }
  });

  const [suggestion, setSuggestion] = useState<string>('');

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

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);


  const onSubmit = useCallback(async () => {

    try {

      if (step === STEPS.INFO) {
        setIsLoading(true);

        const response = await axios.post('/api/suggestion', {
          message,
          urlPath: currentPath,
          userId: user?._id
        });
        console.log("SUG_EST", response.data)

        response && toast('Payment initiated successfully.');

        router.refresh();
        reset();
        response.data && setStep(STEPS.SUCCESS)
        setIsLoading(false);
      };

      if (step === STEPS.SUCCESS) {
        setIsLoading(true);

        router.push(`/`);
        setIsLoading(false);
        router.refresh();
        reset();
        setStep(STEPS.INFO)
        reservationModal.onClose();
      };
      //router.push(`/payment-status?transactionId=${resMtn.transactionId}`);
    } catch (error) {
      console.error(error);
    }
  }, [
    message,
    router
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Submit';
    }
    return 'Thank you for your suggestion.!!';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col">
      <div className='w-full flex justify-center'>
        <Image alt='suggestion_box' src='/images/sug1.png' width={400} height={200} />
      </div>
      <textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={message}
        onChange={(e) => setCustomValue("message", e.target.value)}
        placeholder="Enter your suggestion here..."
      ></textarea>
    </div>
  );

  if (step === STEPS.SUCCESS) {
    bodyContent = (
      <div className="flex flex-col w-full">
        <div className='w-full flex justify-center my-5'>
          <Image alt='suggestion_box' src='/images/sug2.png' width={200} height={200} />
        </div>
      </div>
    )
  }

  let footerContent = (
    <div className='gate-provider'>
      <p className='font-semibold'>Powered by </p><Link href="http://actscloudinc.com" target='_blank'><h4 className='font-bold text-slate-900 cursor-pointer'>&nbsp;ActsCloud Inc.</h4></Link>
    </div>
  )

  return (
    <ModalSuggestion
      isOpen={reservationModal.isOpen}
      title=""
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      disabled={isLoading}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={undefined}
      onClose={reservationModal.onClose}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default SuggestionModal;
