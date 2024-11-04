'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from "react";
import { Range } from 'react-date-range';
import { formatISO } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';

import useChatModal from "@/app/hooks/useChatModal";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect, {
  CountrySelectValue
} from "../inputs/CountrySelect";
import Heading from '../Heading';
//import { ChatEngine } from 'react-chat-engine';
import ChatFeed from '../chats/ChatFeed';
import { useSession } from 'next-auth/react';
import Chat from '../Chat';
import ModalChat from './ModalChat';
import socket from '@/app/lib/socket.io';
import { CreateUserParams } from '@/app/types';
import ChatHome from '../chat/chat';
import { IUser } from '@/app/lib/database/models/user.model';

const projectID = '0d508b62-33c9-4a41-a90a-b2af11540e20';


enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const ChatModal = () => {
  const { data: session } = useSession();
  const user = session?.user
  const router = useRouter();
  const chatModal = useChatModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [client, setClient] = useState(user);
  const [landlord, setLandlord] = useState<CreateUserParams>();

  const openConversation = () => {
    socket.emit('openConversation', client, landlord, (conversationId: string) => {
      setConversationId(conversationId);
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
    openConversation();
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    chatModal.onClose();
    router.push(url);
  },
    [
      step,
      chatModal,
      location,
      router,
      guestCount,
      roomCount,
      dateRange,
      onNext,
      bathroomCount,
      params
    ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Chat conversation"
        subtitle="Landlord and client secure messaging!"
      />
      <ChatHome currentUser={user as IUser} conversationId={conversationId as string} />
    </div>
  )

  return (
    <ModalChat
      isOpen={chatModal.isOpen}
      title="Chat"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={chatModal.onClose}
      body={bodyContent}
    />
  );
}

export default ChatModal;
