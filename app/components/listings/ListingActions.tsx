"use client";

import useFavorite from "@/app/hooks/useFavorite";
import { SafeListing, SafeUser } from "@/app/types";
import { TbBrandStackshare } from "react-icons/tb";
import HeartButton from "../HeartButton";
import ShareButton from "../ShareButton";
import { IListing } from "@/app/lib/database/models/listing.model";

interface HeartButtonProps {
    listingId: string;
    data: IListing;
    currentUser: SafeUser
}

const ListingActions: React.FC<HeartButtonProps> = ({
    listingId,
    data,
    currentUser
}) => {

    return (
        <div
            className="
    absolute
    top-3
    right-3
    flex 
    flex-col 
    gap-2
    items-end 
    w-auto
  "
        >
            <div className="flex flex-col items-center gap-3">
                <ShareButton
                    listingId={listingId}
                    data={data}
                />
                <HeartButton
                    listingId={listingId}
                    currentUser={currentUser}
                />

            </div>
        </div>
    )
}

export default ListingActions