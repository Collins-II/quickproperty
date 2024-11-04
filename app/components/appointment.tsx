'use client';

import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns'; // For date formatting
import { FaCalendarAlt, FaClock } from 'react-icons/fa'; // Icons for calendar and clock
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Make sure to install this

interface AppointmentProps {
    selectedDate: Date | null | undefined;
    selectedTime: string | undefined;
    setSelectedDate: Dispatch<SetStateAction<Date | null | undefined>>;
    setSelectedTime: Dispatch<SetStateAction<string | undefined>>;
}

const Appointment = ({ setSelectedDate, setSelectedTime, selectedDate, selectedTime }: AppointmentProps) => {
    const [appointmentDate, setAppointmentDate] = useState<Date>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isToday, setIsToday] = useState(true); // Toggle between "Today" or "Later" for the date
    const [isNow, setIsNow] = useState(true); // Toggle between "Now" or "Later" for the time
    const [isOpen, setIsOpen] = useState(false); // State to control calendar visibility

    const handleDateToggle = (option: 'today' | 'later') => {
        setIsToday(option === 'today');
        if (option === 'today') {
            setSelectedDate(new Date()); // Set date to today
            setIsOpen(false); // Close calendar when "Today" is selected
        } else {
            setIsOpen(true); // Open calendar when "Later" is selected
        }
    };

    const handleTimeToggle = (option: 'now' | 'later') => {
        setIsNow(option === 'now');
        if (option === 'now') {
            setSelectedTime(format(new Date(), 'HH:mm')); // Set time to current time
        }
    };

    const availableDates = useMemo(() => {
        if (!selectedDate) {
            return []; // Return an empty array or provide default dates if selectedDate is null or undefined
        }
        return Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i + 1));
    }, [selectedDate]);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setAppointmentDate(date); // Update the selected date
            setSelectedDate(date);    // Set the date in the parent state
            setIsOpen(false);         // Close the calendar after selecting a date
        } else {
            setAppointmentDate(undefined); // Clear the date if null
        }
    };

    return (
        <div className="relative max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-1xl font-semibold text-center">Set Appointment</h2>
            <div className='flex items-center gap-2 w-full'>
                {/* Date Selection */}
                <div className="mb-2 w-full">
                    <FaCalendarAlt className="flex align-center text-md text-gray-300 font-semibold mb-1 ml-3" />
                    <div className="flex items-center mb-2 rounded-full overflow-hidden">
                        <button
                            className={`w-full px-4 py-2 ${isToday ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleDateToggle('today')}
                        >
                            Today
                        </button>
                        <button
                            className={`w-full px-4 py-2 ${!isToday ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleDateToggle('later')}
                        >
                            Later
                        </button>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="mb-2 w-full">
                    <FaClock className="flex align-center text-md font-semibold text-gray-300 mb-1 ml-3" />
                    <div className="flex items-center mb-2 rounded-full overflow-hidden">
                        <button
                            className={`px-4 py-2 w-full ${isNow ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTimeToggle('now')}
                        >
                            Now
                        </button>
                        <button
                            className={`px-4 py-2 w-full ${!isNow ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTimeToggle('later')}
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>

            <div className='w-full flex items-center justify-center'>
                {/* Calendar for "Later" option */}
                {!isToday && isOpen && (
                    <div className="flex flex-col justify-center items-center absolute top-0">
                        <DatePicker
                            selected={appointmentDate}
                            onChange={handleDateChange}
                            includeDates={availableDates}
                            inline
                        />
                    </div>
                )}

                {/* Time Picker for "Later" option */}
                {!isNow && (
                    <div className="flex justify-center items-center">
                        <input
                            type="time"
                            className="border border-gray-300 p-2 rounded-lg"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Display Selected Date and Time */}
            {selectedDate && selectedTime && (
                <div className="mt-2">
                    <div className='flex flex-col gap-2'>
                        <p className="mt-2 font-light p-2 bg-gray-200 text-slate-900 rounded-full">
                            <strong>Date:</strong>{' '}
                            {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}
                        </p>
                        <p className="font-light p-2 bg-gray-200 text-slate-900 rounded-full">
                            <strong>Time:</strong> {selectedTime}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointment;
