"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type UserLocation = {
  lat: number;
  lng: number;
};

interface UserLocationContextProps {
  userLocation: UserLocation;
  setUserLocation: Dispatch<SetStateAction<UserLocation>>;
}

// Create the context
const UserLocationContext = createContext<UserLocationContextProps | undefined>(
  undefined
);

// Provider component
export const UserLocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 0,
    lng: 0,
  });

  return (
    <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};

// Custom hook to use the UserLocationContext
export const useUserLocation = () => {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error(
      "useUserLocation must be used within a UserLocationProvider"
    );
  }
  return context;
};
