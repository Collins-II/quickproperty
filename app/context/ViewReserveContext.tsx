"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { SafeListing } from '../types';

interface PropertyContextProps {
    selectedDate: Date | null | undefined;
    selectedTime: string | undefined;
    setSelectedDate: Dispatch<SetStateAction<Date>>;
    setSelectedTime: Dispatch<SetStateAction<string>>;
    selectedPropertyView: SafeListing | null;
    setSelectedPropertyView: (property: SafeListing | null) => void;
    isModalOpenView: boolean;
    setIsModalOpenView: Dispatch<SetStateAction<boolean>>;
}

// Create the context
const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

// Provider component
export const ViewReserveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Current date
    const [selectedTime, setSelectedTime] = useState<string>(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }); // Current time in HH:MM AM/PM format
    const [selectedPropertyView, setSelectedPropertyView] = useState<SafeListing | null>(null);
    const [isModalOpenView, setIsModalOpenView] = useState(false);

    return (
        <PropertyContext.Provider value={{ selectedPropertyView, setSelectedPropertyView, isModalOpenView, setIsModalOpenView, selectedDate, setSelectedDate, selectedTime, setSelectedTime }}>
            {children}
        </PropertyContext.Provider>
    );
};

// Custom hook to use the PropertyContext
export const useViewContext = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
};
