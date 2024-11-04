"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';

import { runFireworks } from '../../lib/utils';
import { getUserById } from "@/app/actions/user.actions";
import { IUser } from "@/app/lib/database/models/user.model";
import { useRouter } from "next/navigation";
import useReservationModal from "@/app/hooks/useReservationModal";
import Heading from "../Heading";

interface PaymentPageProps {
    onSubmit: () => void;
    isLoading: boolean;
    landlord: string;
}

const Success = ({ onSubmit, isLoading, landlord }: PaymentPageProps) => {
    const [user, setUser] = useState<IUser>()
    const router = useRouter();
    const reservationModal = useReservationModal();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUserById(landlord)

            setUser(res)
        };

        fetchUser();
        runFireworks();
    }, [landlord]);

    const handleSubmit = useCallback(() => {
        if (isLoading) {
            return;
        }

        onSubmit();
    }, [onSubmit, isLoading]);

    const onReserve = useCallback(async () => {
        router.push('/reservations')
        reservationModal.onClose();
    }, [user])

    return (
        <div className="success-wrapper flex flex-col">
            <div className="success">
                <Heading title="Thank you for your reservation!" subtitle="Check your profile reservations for records" />

                <p className="icon mt-5">
                    <BsBagCheckFill size={100} />
                </p>
                <p className="description">
                    If you have any questions, please email
                    <Link className="email" href={`mailto:${user?.email}`}>
                        {user?.email}
                    </Link>
                </p>


            </div>
            <button
                className="mt-8 w-full bg-red-500 text-white p-4 rounded-full shadow-md hover:bg-red-600 transition"
                disabled={isLoading}
                onClick={onSubmit}
            >
                {isLoading ? 'Processing...' : 'Start Conversation'}
            </button>
        </div>
    )
}

export default Success