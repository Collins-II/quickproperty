// components/SuggestionBox.tsx

'use client';

import { useState } from 'react';
import useSuggestionModal from '../hooks/useSuggestionModal';
import Image from 'next/image';
import useLoginModal from '../hooks/useLoginModal';
import { useSession } from 'next-auth/react';

const SuggestionBox: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user

    const useSuggestion = useSuggestionModal();
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const handleOpen = () => {
        if (user) {
            useSuggestion.onOpen();
        } else {
            loginModal.onOpen();
        }

        //setIsOpen(true);
    };

    const handleClose = () => {
        useSuggestion.onClose();
        //setIsOpen(false);
    };

    const handleSubmit = () => {
        // Handle the suggestion submission logic here
        console.log('Suggestion submitted:', suggestion);
        setSuggestion('');
        useSuggestion.onClose()
        //handleClose();
    };

    return (
        <div className="fixed bottom-5 lg:bottom-10 right-5 lg:right-10 z-50">
            {!isOpen && (
                <Image alt='suggestion_img' src='/images/sug1.png' width={100} height={100} className='hover:scale-120 cursor-pointer' onClick={handleOpen} />
            )}
            {isOpen && (
                <div className="bg-white p-4 rounded-lg shadow-lg w-64">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Suggestion Box</h2>
                        <button
                            className="text-gray-400 hover:text-gray-600 transition"
                            onClick={handleClose}
                        >
                            &times;
                        </button>
                    </div>
                    <textarea
                        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Enter your suggestion here..."
                    ></textarea>
                    <button
                        className="bg-blue-600 text-white mt-4 w-full py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuggestionBox;
