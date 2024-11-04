"use client";

import { useState } from "react";

interface ListingDescriptionProps {
    description: string;
}

const ListingDescription: React.FC<ListingDescriptionProps> = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false); // State to track if expanded or not
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // Limit description length for "See More" functionality
    const MAX_LENGTH = 200;
    const displayedText = isExpanded ? description : description.slice(0, MAX_LENGTH);

    return (
        <div className="flex flex-col gap-2">
            {/* Display truncated or full description */}
            <p className="text-1xl font-light text-neutral-800">
                {displayedText}
                {!isExpanded && description.length > MAX_LENGTH && '...'}
            </p>

            {/* Toggle button for See More / See Less */}
            {description.length > MAX_LENGTH && (
                <button
                    onClick={toggleExpanded}
                    className="text-slate-500 font-semibold hover:underline"
                >
                    {isExpanded ? "See Less" : "See More"}
                </button>
            )}
        </div>
    );
};

export default ListingDescription;
