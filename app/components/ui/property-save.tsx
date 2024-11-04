'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";
import { clsx } from "clsx";
import { FaHeart } from "react-icons/fa";

interface PropertySaveProps {
    listingId: string;
    currentUser: SafeUser | null;
}

const PropertySave: React.FC<PropertySaveProps> = ({
    listingId,
    currentUser
}) => {
    const { hasFavorited, toggleFavorite } = useFavorite({
        listingId,
        currentUser
    });

    return (
        <div
            onClick={toggleFavorite}
            className="
        hover:opacity-80
        transition
        cursor-pointer
      "
        >
            <FaHeart
                size={28}
                className={clsx(``,
                    hasFavorited ? "fill-rose-500" : "fill-slate-900")}
            />
        </div>
    );
}

export default PropertySave;
