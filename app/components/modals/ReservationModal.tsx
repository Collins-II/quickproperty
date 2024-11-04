'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';
import { useRouter } from "next-nprogress-bar";

import useReservationModal from "@/app/hooks/useReservationModal";

import Modal from "./PaymentModal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from '../Heading';
import Input from '../inputs/Input';
import { FieldValues, useForm } from 'react-hook-form';
import PhoneInput from '../inputs/InputNumber';
import { listingTypes } from '../navbar/Categories';
import { networkTypes, paymentOptionsData, receiptDetails } from '@/app/data';
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
import EReceipt from '../ui/EReceipt';
import { useProperty } from '@/app/context/PropertyContext';
import PaymentOptions from '../PaymentOptions';

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

const ReservationModal = () => {
  const { data: session } = useSession();
  const user = session?.user

  const router = useRouter();
  const { selectedDate, selectedTime } = useProperty();
  const reservationModal = useReservationModal();
  const propertyUserId = reservationModal.propertyUserId;
  const price = reservationModal.price;
  const listingId = reservationModal.listingId;

  const [step, setStep] = useState(STEPS.INFO);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<CountrySelectValue>();

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: '',
      network: ''
    }
  });

  const [conversation, setConversation] = useState<ChatBoxProps>();
  const [listing, setListing] = useState<listingType>();
  const callback = "http://localhost:3000/successful-payment";
  const [updatePesapalIPNID, setUpdatePesapalIPNID] = useState<string>(''); // Set your IPN ID here
  const [message, setMessage] = useState<string>('');
  const [phoneContact, setPhoneContact] = useState<string>('');

  const network = watch('network');
  const mobileNumber = watch('phoneNumber');

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any | null>(null);

  // Handles selection of a payment method
  const onPaymentMethodSelect = (method: "mobile" | "visa" | "cash") => {
    setPaymentMethod(method);
    console.log("Selected Payment Method:", method);
  };

  // Handles form submission and initiates payment processing
  const onPaymentSubmit = async (details: any) => {
    setPaymentDetails(details);
    console.log("Payment Details:", details);
   
    try {

      if (step === STEPS.INFO) {
        setIsLoading(true);
        const response = await axios.post('/api/payment', {
          method: paymentMethod,
          listingId,
          amount: price,
        totalPrice: price,
        selectedDate,
        selectedTime,
          ...details,
        });

        response && setMessage('Payment initiated successfully.');
        router.refresh();
        reset();
        response && setStep(STEPS.SUCCESS)
        setIsLoading(false);
      };
      //router.push(`/payment-status?transactionId=${resMtn.transactionId}`);
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    const ipnd = async () => {
      const ids = await registerIPN("localhost:3000/");

      setUpdatePesapalIPNID(ids.ipn_id);
    }

    ipnd();
  }, [])

  useEffect(() => {
    const fetchListing = async () => {
      const res = await getListingById({ listingId })

      res && setListing(res)
    }
    fetchListing();
  }, [])

  const onSubmit = useCallback(async () => {
    const dataObj = {
      amount: price,
      mobileNumber: mobileNumber,
      listingId,
      totalPrice: price,
      selectedDate,
      selectedTime
    }

    try {

      if (step === STEPS.INFO) {
        setIsLoading(true);
        const response = await axios.post('/api/payment', dataObj);

        response && setMessage('Payment initiated successfully.');
        router.refresh();
        reset();
        response && setStep(STEPS.SUCCESS)
        setIsLoading(false);
      };
      //router.push(`/payment-status?transactionId=${resMtn.transactionId}`);
    } catch (error) {
      console.error(error);
    }
  }, [
    mobileNumber,
    price,
    listingId,
    propertyUserId,
    router
  ]);

  const onSuccess = useCallback(async () => {

    try {

      setIsLoading(true);
      const conversation = await axios.post('/api/conversations', { userId: propertyUserId });
      if (conversation) {
        router.push(`/conversations/${conversation.data._id}`);
        setIsLoading(false);
        router.refresh();
        reset();
        setStep(STEPS.INFO)
        reservationModal.onClose();
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    propertyUserId,
    router
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Pay Now';
    }
    return 'Start Conversation';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  const onHost = () => {

  }


  let bodyContent = (
    <PaymentOptions onPaymentMethodSelect={onPaymentMethodSelect} onPaymentSubmit={onPaymentSubmit}/>
    //<PaymentPage price={price} listing={listing as listingType} isLoading={isLoading} register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} />
  );

  if (step === STEPS.SUCCESS) {
    bodyContent = (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Payment Success</h1>
        <p>Your payment was successful! Here is your receipt:</p>

        <EReceipt details={receiptDetails} />
      </div>
      //<PaymentSuccess onSubmit={onSuccess} isLoading={isLoading} landlord={propertyUserId} />
    )
  }

  let footerContent = (
    <div className='gate-provider'>
      <p className='font-semibold'>Powered by </p><Link href="http://actscloudinc.com" target='_blank'><h4 className='font-bold text-slate-900 cursor-pointer'>&nbsp;ActsCloud Inc.</h4></Link>
    </div>
  )

  return (
    <Modal
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

export default ReservationModal;
