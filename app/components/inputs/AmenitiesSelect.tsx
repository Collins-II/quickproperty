'use client';

import { IconType } from "react-icons";
import { FaHouseUser, FaTree, FaCity, FaLeaf } from "react-icons/fa"; // Example icons, replace with appropriate ones

interface AmenitiesSelectProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    onClick: (value: string) => void;
}

const AmenitiesSelect: React.FC<AmenitiesSelectProps> = ({
    icon: Icon,
    label,
    selected,
    onClick,
}) => {
    return (
        <div
            onClick={() => onClick(label)}
            className={`
                w-full
        rounded-xl
        border-2
        p-2
        flex
        justify-center
        items-center
        flex-col
        gap-3
        hover:border-black
        transition
        cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}
      `}
        >
            <Icon size={24} />
            <p className="font-light sm:text-sm md:text-lg lg:text-xl px-1">
                {label}
            </p>
        </div>
    );
};

export default AmenitiesSelect;
