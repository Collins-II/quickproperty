'use client';

import useFavorite from "@/app/hooks/useFavorite";
import { SafeListing, SafeUser } from "@/app/types";
import { TbBrandStackshare } from "react-icons/tb";
import { FaFacebookF, FaRegCopy, FaTwitter, FaWhatsapp } from "react-icons/fa"; // Import additional icons
import HeartButton from "../HeartButton";
import ShareButton from "../ShareButton";
import { IListing } from "@/app/lib/database/models/listing.model";
import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface ShareLinksProps {
    listingId: string;
    data: IListing;
    currentUser: SafeUser;
}

const ShareLinks: React.FC<ShareLinksProps> = ({
    listingId,
    data,
    currentUser
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopied(false), 2000);
    };
    // URL to be shared (replace with the actual URL of the listing)
    const listingUrl = `https://yourapp.com/listing/${listingId}`;
    const shareText = `Check out this listing: ${data.title}`;

    // Social media share URLs
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${listingUrl}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${listingUrl}&text=${shareText}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText} ${listingUrl}`;

    return (
        <div
            className="
                flex 
                flex-col 
                gap-2
                items-end 
                w-auto
            "
        >
            <div className="flex flex-row items-center gap-3">
                {/* Share Buttons for Social Media */}
                <Link
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    aria-label="Share on Facebook"
                >
                    <FaFacebookF size={18} />
                </Link>

                <Link
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition"
                    aria-label="Share on Twitter"
                >
                    <FaTwitter size={18} />
                </Link>

                <Link
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                    aria-label="Share on WhatsApp"
                >
                    <FaWhatsapp size={18} />
                </Link>

                {/* Existing Share Button */}
                <CopyToClipboard text={listingUrl} onCopy={handleCopy}>
                    <button className="p-2 rounded-full bg-slate-400 text-white hover:bg-slate-500 transition">
                        <FaRegCopy size={18} />
                    </button>
                </CopyToClipboard>

                {/* Favorite (Heart) Button */}
                <HeartButton
                    listingId={listingId}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
};

export default ShareLinks;
