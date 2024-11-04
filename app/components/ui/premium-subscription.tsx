'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PremiumSubscription = () => {
    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDays(Number(event.target.value));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return;
        }

        try {
            const { data: clientSecret } = await axios.post('/api/create-payment-intent', {
                amount: days * 1000 // Example: $10 per day
            });

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (paymentResult.error) {
                console.error(paymentResult.error.message);
            } else if (paymentResult.paymentIntent?.status === 'succeeded') {
                console.log('Payment succeeded!');
            }
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Premium Subscription</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                        Number of Days
                    </label>
                    <input
                        type="number"
                        id="days"
                        value={days}
                        onChange={handleDaysChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        min="1"
                    />
                </div>
                <div className="mb-4">
                    <CardElement className="p-3 border border-gray-300 rounded-md" />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                    disabled={!stripe || loading}
                >
                    {loading ? 'Processing...' : `Pay $${days * 10}`}
                </button>
            </form>
        </div>
    );
};

const PremiumSubscriptionWrapper = () => {
    return (
        <Elements stripe={stripePromise}>
            <PremiumSubscription />
        </Elements>
    );
};

export default PremiumSubscriptionWrapper;
