'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Badge from './badge';
import { IconType } from 'react-icons';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, addWeeks, addMonths, differenceInDays } from 'date-fns';
import Countdown from './countdown';
import PricingPackageSelector from './pricing-package';

interface PremiumCardProps {
    title: string;
    icon: IconType;
    description: string;
    price: number;
    duration: string;
    imageUrl: string;
    isPremium: boolean;
    isLoading: boolean;
    targetDate: Date;
    onSubscribe: (data: { premiumTargetDate: Date }) => void;
}

interface DataProps {
    premiumTargetDate: Date;
    price: number
}

const packages = [
    { label: 'Basic', price: 10, duration: '1 day' },
    { label: 'Standard', price: 25, duration: '1 week' },
    { label: 'Premium', price: 90, duration: '1 month' }
];

const PremiumCard: React.FC<PremiumCardProps> = ({
    title,
    icon: Icon,
    description,
    imageUrl,
    isPremium,
    isLoading,
    targetDate,
    onSubscribe
}) => {
    const { control, handleSubmit, watch, setValue } = useForm();
    const [startDate, setStartDate] = useState(new Date());
    const [selectedPackage, setSelectedPackage] = useState(packages[0]);
    const calculateEndDate = (startDate: Date, duration: string) => {
        switch (duration) {
            case '1 day':
                return addDays(startDate, 1);
            case '1 week':
                return addWeeks(startDate, 1);
            case '1 month':
                return addMonths(startDate, 1);
            default:
                return startDate;
        }
    };

    const endDate = calculateEndDate(new Date(), selectedPackage.duration);

    useEffect(() => {
        const endDate = calculateEndDate(startDate, selectedPackage.duration);
        setValue('premiumTargetDate', endDate);
    }, [startDate, selectedPackage, setValue]);

    const selectedDate = watch('premiumTargetDate', endDate);
    const daysSelected = selectedDate ? differenceInDays(selectedDate, new Date()) : 0;

    const onSubmit = (data: any) => {
        onSubscribe(data);
    };

    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="md:flex-shrink-0">
                    <Image
                        className="h-48 w-full object-cover md:h-full md:w-48"
                        src={imageUrl}
                        alt="Premium"
                        width={192}
                        height={192}
                    />
                </div>
                <div className="p-8">
                    <div className="flex flex-row items-center gap-4 tracking-wide">
                        <p className='uppercase text-sm text-rose-500 font-semibold'>{title}</p>
                        <Badge icon={Icon} />
                    </div>
                    <p className="mt-2 text-gray-500">{description}</p>

                    <PricingPackageSelector
                        packages={packages}
                        selectedPackage={selectedPackage}
                        onSelectPackage={setSelectedPackage}
                    />

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                        {!isPremium ? (
                            <div className="mb-4">
                                {/* <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Premium Target Date
                                </label>
                                <Controller
                                    name="premiumTargetDate"
                                    control={control}
                                    //* defaultValue={startDate}*
                                    render={({ field }) => (
                                        <DatePicker
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            selected={field.value}
                                            onChange={(date) => {
                                                field.onChange(date);
                                                setStartDate(date as Date);
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            placeholderText="Select a future date"
                                            showPopperArrow={false}
                                        />
                                    )}
                                />*/}
                                {selectedDate && (
                                    <div className="text-gray-500 text-sm mb-4 pt-2">
                                        {daysSelected > 0 ? `You have selected ${daysSelected} days subscription.` : 'Please select a future date.'}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex justify-center items-center space-x-2 sm:space-x-1 md:space-x-2 p-4 bg-white'>
                                {Object.keys(timeLeft).map((unit) => (
                                    <div key={unit} className="text-center">
                                        <div className="text-slate-900 text-2xl font-bold">
                                            {timeLeft[unit as keyof typeof timeLeft]}
                                        </div>
                                        <div className="uppercase text-sm sm:text-xs md:text-sm text-gray-300">
                                            {unit}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center bg-rose-500 hover:bg-rose-600 text-white font-bold mt-2 py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            {!isPremium ? 'Subscribe Now' : 'Unsubscribe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PremiumCard;
