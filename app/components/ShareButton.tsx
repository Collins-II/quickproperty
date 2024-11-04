'use client';

import useFavorite from "@/app/hooks/useFavorite";
import { SafeListing, SafeUser } from "@/app/types";
import { cn } from "../lib/utils";
import { clsx } from "clsx";
import { TbBrandStackshare } from "react-icons/tb";
import useShareModal from "../hooks/useShareModal";
import { IListing } from "../lib/database/models/listing.model";
import { useProperty } from "../context/PropertyContext";
import { useState } from "react";

interface ShareButtonProps {
    listingId: string;
    data: IListing;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    listingId,
    data
}) => {
    const { setSelectedProperty, setIsModalOpen } = useProperty();

    const handleShareClick = () => {
        setSelectedProperty(data as any); // Set the property to the context
        setIsModalOpen(true); // Open the modal
    };

    return (
        <div
            onClick={handleShareClick}
            className="
    p-2 
    rounded-full 
    shadow-md 
    bg-blue-100 
        hover:bg-white
    transition-all 
    duration-200
    flex 
    items-center 
    justify-center
  "
        >
            <TbBrandStackshare />
        </div>
    );
}

export default ShareButton;
