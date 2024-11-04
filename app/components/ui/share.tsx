"use client";
import { FC, useState } from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaLink } from 'react-icons/fa';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Link from 'next/link';
import PropertySave from './property-save';
import { SafeListing, SafeUser } from '@/app/types';
import { IListing } from '@/app/lib/database/models/listing.model';

interface ShareLinksProps {
    url: string;
    title: string;
    listingId: string;
    currentUser: SafeUser;
    data: SafeListing;
}

const ShareLinks: FC<ShareLinksProps> = ({ url, title, listingId, currentUser, data }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-2 grid grid-cols-2 sm:grid-cols-2 gap-4 items-center">
            <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center p-2 border-[1px] rounded-md text-blue-600 hover:text-blue-800 transition"
            >
                <FaFacebook size={32} /> <p>Facebook</p>
            </Link>
            <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center p-2 border-[1px] rounded-md text-blue-400 hover:text-blue-600 transition"
            >
                <FaTwitter size={32} /> <p>Twitter</p>
            </Link>
            <Link
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center p-2 border-[1px] rounded-md text-green-600 hover:text-green-800 transition"
            >
                <FaWhatsapp size={32} /> <p>Whatsapp</p>
            </Link>
            <PropertySave listingId={listingId} currentUser={currentUser} />
            <CopyToClipboard text={url} onCopy={handleCopy}>
                <button className="text-gray-600 hover:text-gray-800 transition">
                    <FaLink size={28} />
                </button>
            </CopyToClipboard>
            {copied && <span className="text-green-500">Link copied!</span>}
        </div>
    );
};

export default ShareLinks;
