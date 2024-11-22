"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Business } from "../types";
import { IListing } from "../lib/database/models/listing.model";

interface SelectedBusinessContextType {
  selectedBusiness: IListing | null;
  setSelectedBusiness: Dispatch<SetStateAction<IListing | null>>;
}

// Create the context
const SelectedBusinessContext = createContext<SelectedBusinessContextType | undefined>(undefined);

// Provider component
export const SelectedBusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<IListing | null>(null);

  return (
    <SelectedBusinessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </SelectedBusinessContext.Provider>
  );
};

// Custom hook to use the SelectedBusinessContext
export const useSelectedBusiness = () => {
  const context = useContext(SelectedBusinessContext);
  if (!context) {
    throw new Error("useSelectedBusiness must be used within a SelectedBusinessProvider");
  }
  return context;
};
