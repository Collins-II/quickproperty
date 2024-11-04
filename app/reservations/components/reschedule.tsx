'use client';

import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface RescheduleProps {
  initialDate: Date | null | undefined;
  initialTime: string | undefined;
  setUpdatedDate: Dispatch<SetStateAction<Date | null | undefined>>;
  setUpdatedTime: Dispatch<SetStateAction<string | undefined>>;
  onSubmitReschedule: () => void;
  onCancel: () => void;
}

const Reschedule = ({
  initialDate,
  initialTime,
  setUpdatedDate,
  setUpdatedTime,
  onSubmitReschedule,
  onCancel
}: RescheduleProps) => {
  const [appointmentDate, setAppointmentDate] = useState<Date | null | undefined>(initialDate);
  const [appointmentTime, setAppointmentTime] = useState<string | undefined>(initialTime);
  const [isToday, setIsToday] = useState(appointmentDate ? appointmentDate.getDate() === new Date().getDate() : true);
  const [isNow, setIsNow] = useState(appointmentTime ? false : true);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateToggle = (option: 'today' | 'later') => {
    setIsToday(option === 'today');
    if (option === 'today') {
      const today = new Date();
      setAppointmentDate(today);
      setUpdatedDate(today);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleTimeToggle = (option: 'now' | 'later') => {
    setIsNow(option === 'now');
    if (option === 'now') {
      const nowTime = format(new Date(), 'HH:mm');
      setAppointmentTime(nowTime);
      setUpdatedTime(nowTime);
    }
  };

  const availableDates = useMemo(() => {
    if (!appointmentDate) return [];
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));
  }, [appointmentDate]);

  const handleDateChange = (date: Date | null) => {
    setAppointmentDate(date);
    setUpdatedDate(date);
    setIsOpen(false);
  };

  return (
    <div className="relative bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Reschedule Appointment</h2>

      <div className="flex items-center gap-2 w-full mb-4">
        {/* Date Selection */}
        <div className="w-full">
          <FaCalendarAlt className="text-md text-gray-400 font-semibold mb-1 ml-3" />
          <div className="flex items-center rounded-full overflow-hidden">
            <button
              className={`w-full px-4 py-2 ${isToday ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleDateToggle('today')}
            >
              Today
            </button>
            <button
              className={`w-full px-4 py-2 ${!isToday ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleDateToggle('later')}
            >
              Later
            </button>
          </div>
        </div>

        {/* Time Selection */}
        <div className="w-full">
          <FaClock className="text-md font-semibold text-gray-400 mb-1 ml-3" />
          <div className="flex items-center rounded-full overflow-hidden">
            <button
              className={`w-full px-4 py-2 ${isNow ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTimeToggle('now')}
            >
              Now
            </button>
            <button
              className={`w-full px-4 py-2 ${!isNow ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleTimeToggle('later')}
            >
              Later
            </button>
          </div>
        </div>
      </div>

      {/* Calendar for "Later" option */}
      {!isToday && isOpen && (
        <div className="flex justify-center mb-4">
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
        <div className="flex justify-center items-center mb-4">
          <input
            type="time"
            className="border border-gray-300 p-2 rounded-lg"
            value={appointmentTime}
            onChange={(e) => {
              setAppointmentTime(e.target.value);
              setUpdatedTime(e.target.value);
            }}
          />
        </div>
      )}

      {/* Display Selected Date and Time */}
      <div className="flex flex-col gap-2 mt-2">
        <p className="mt-2 font-light p-2 bg-gray-200 text-slate-900 rounded-full">
          <strong>Date:</strong> {appointmentDate ? format(appointmentDate, 'PPP') : 'Not selected'}
        </p>
        <p className="font-light p-2 bg-gray-200 text-slate-900 rounded-full">
          <strong>Time:</strong> {appointmentTime || 'Not selected'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
          onClick={onSubmitReschedule}
          disabled={!appointmentDate || !appointmentTime}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Reschedule;