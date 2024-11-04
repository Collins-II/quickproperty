"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { transactionStatus } from '../lib/payment.server';
import { useSearchParams } from 'next/navigation';
import useReservationModal from '../hooks/useReservationModal';
import { useRouter } from 'next/navigation';

interface PaymentDetails {
    amount: number;
    currency: string;
    order_tracking_id: string;
    payment_method: string;
    status: string;
    description: string;
    sellerEmail: string;
}

interface HomeProps {
    searchParams: {
        OrderTrackingId: string;
        OrderMerchantReference: string;
    }
};

const PaymentSuccess = ({ searchParams }: HomeProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const reservationModal = useReservationModal();
    const propertyUserId = reservationModal.propertyUserId;
    const price = reservationModal.price;
    const listingId = reservationModal.listingId;

    console.log("TRCK_ID_OBJ", { listingId, totalPrice: price })

    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
    const trackingId = searchParams.OrderTrackingId

    useEffect(() => {
        // Fetch payment details from your API
        const fetchPaymentDetails = async () => {
            try {
                const response = await transactionStatus(trackingId); // Adjust the endpoint as needed

                setPaymentDetails(response);
            } catch (error) {
                console.log("fetffch_details", error)
                console.error('Error fetching payment details:', error);
            }
        };

        fetchPaymentDetails();
    }, []);

    const handleStartConversation = async () => {
        router.push("/conversations")
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Payment Successful</h2>
                <div className="mb-4">
                    <div className="text-gray-700">Transaction ID:</div>
                    <div className="text-gray-900 font-semibold">{paymentDetails?.order_tracking_id}</div>
                </div>
                <div className="mb-4">
                    <div className="text-gray-700">Amount:</div>
                    <div className="text-gray-900 font-semibold">{paymentDetails?.amount} {paymentDetails?.currency}</div>
                </div>
                <div className="mb-4">
                    <div className="text-gray-700">Payment Method:</div>
                    <div className="text-gray-900 font-semibold">{paymentDetails?.payment_method}</div>
                </div>
                <div className="mb-4">
                    <div className="text-gray-700">Status:</div>
                    <div className="text-gray-900 font-semibold">{paymentDetails?.description}</div>
                </div>
                <button
                    onClick={handleStartConversation}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                >
                    {isLoading ? "Creating conversation " : "Start Conversation with Seller"}
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
