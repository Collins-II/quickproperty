"use client";
import React from 'react';
import { useProperty } from '../context/PropertyContext';
import { SafeListing, SafeUser } from '../types';
import ShareLinks from './ui/share';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();
    const user = session?.user;
    const { selectedProperty } = useProperty();

    if (!isOpen || !selectedProperty) return null;

    const url = 'https://yourpropertylisting.com/property/12345';
    const title = 'Check out this amazing property!';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 translate duration-500">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="
                rounded-t
                border-b-[1px]
                mb-4
                "
                >
                    <button
                        className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                  "
                        onClick={onClose}
                    >
                        <IoMdClose size={18} />
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-4">Share this property with friends</h2>
                <p className="text-sm text-gray-600">You are about to share:</p>
                <div className="my-2">
                    <img src={selectedProperty.imageSrc[0]} alt={selectedProperty.title} className="w-full h-40 object-cover rounded-md" />
                    <h3 className="mt-2 text-lg font-bold">{selectedProperty.title}</h3>
                    <p className="text-sm md:text-md text-slate-800 font-semibold">{selectedProperty.property_type}</p>
                    <p className="text-sm md:text-md text-slate-500 font-semibold">{selectedProperty.compound}</p>
                    <p className="text-sm md:text-md text-slate-900 font-semibold">ZMW {selectedProperty.price}</p>
                </div>
                <hr />
                <ShareLinks url={url} title={title} listingId='' currentUser={user as SafeUser} data={selectedProperty as SafeListing} />
            </div>
        </div>
    );
};

export default ShareModal;
