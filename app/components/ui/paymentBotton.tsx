"use client"

import React, { useState } from 'react';
import axios from 'axios';

interface PaymentProps {
    transactionAmount: number;
    transactionReference?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string | null;
    customerPhone: string;
}

const PaymentButton = ({ transactionAmount, transactionReference, customerFirstName, customerLastName, customerEmail, customerPhone }: PaymentProps) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/dpo/initiate-payment', {
                transactionAmount,
                transactionReference,
                customerFirstName,
                customerLastName,
                customerEmail,
                customerPhone,
                // Add other required fields as per DPO API documentation
            });

            const { paymentUrl } = response.data;
            window.location.href = paymentUrl;
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
        </button>
    );
};

export default PaymentButton;
