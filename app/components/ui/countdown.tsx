'use client';

import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface CountdownProps {
    targetDate: string; // The target date in ISO format
    id: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, id }) => {
    const { data: session } = useSession();
    const user = session?.user;

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
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            // If time reaches zero, unpublish the listing
            if (
                newTimeLeft.days === 0 &&
                newTimeLeft.hours === 0 &&
                newTimeLeft.minutes === 0 &&
                newTimeLeft.seconds === 0
            ) {
                clearInterval(timer); // Stop the timer
                axios.patch(`/api/properties/${id}/unpremier`, { user })
                    .then(() => {
                        console.log('Property unsubscribed successfully');
                    })
                    .catch((error) => {
                        console.error('Failed to unsubscribe the property:', error);
                    });
            }
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, [targetDate, id, user]);

    return (
        <div className="flex justify-center items-center gap-1 py-2 pl-5 pr-2 bg-white shadow-xs rounded-lg">
            {Object.keys(timeLeft).map((unit) => (
                <div key={unit} className="text-center">
                    <div className="text-red-500 text-md sm:text-sm md:text-md font-semibold">
                        {timeLeft[unit as keyof typeof timeLeft]}
                    </div>
                    {/*<div className="uppercase text-xs sm:text-xs md:text-sm text-gray-300">
                        {unit}
                    </div>*/}
                </div>
            ))}
        </div>
    );
};

export default Countdown;
