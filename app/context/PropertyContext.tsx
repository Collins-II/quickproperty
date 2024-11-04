"use client";
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { SafeListing } from '../types';

interface PropertyContextProps {
    selectedDate: Date | null | undefined;
    selectedTime: string | undefined;
    setSelectedDate: Dispatch<SetStateAction<Date>>;
    setSelectedTime: Dispatch<SetStateAction<string>>;
    selectedProperty: SafeListing | null;
    setSelectedProperty: (property: SafeListing | null) => void;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

// Create the context
const PropertyContext = createContext<PropertyContextProps | undefined>(undefined);

// Provider component
export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Current date
    const [selectedTime, setSelectedTime] = useState<string>(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }); // Current time in HH:MM AM/PM format
    const [selectedProperty, setSelectedProperty] = useState<SafeListing | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <PropertyContext.Provider value={{ selectedProperty, setSelectedProperty, isModalOpen, setIsModalOpen, selectedDate, setSelectedDate, selectedTime, setSelectedTime }}>
            {children}
        </PropertyContext.Provider>
    );
};

// Custom hook to use the PropertyContext
export const useProperty = () => {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
};
