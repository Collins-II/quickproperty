'use client';

import Image from "next/image";
import { IconType } from "react-icons";

interface PropertyInputProps {
  icon: string;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  icon,
  label,
  selected,
  onClick
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`
        rounded-xl
        border-2
        w-[100px]
        h-[140px]
        px-1
        py-2
        relative
        flex
        justify-center
        items-start
        gap-3
        hover:border-neutral-200
        transition
        cursor-pointer
        overflow-hidden
        
      `}
    >
      <Image
        alt="property type_image"
        src={icon}
        fill
        className="opacity-50"
      />
      <p className={`
        absolute 
        bottom-3 
        font-semibold 
        text-xs 
        bg-gradient-to-r from-blue-500 to-teal-500
        text-white 
        px-2 py-1 
        rounded-md 
        max-w-full 
        text-center 
        ${selected ? 'bg-yellow-800 text-white' : 'border-neutral-200'}
        overflow-hidden 
        text-ellipsis 
        whitespace-nowrap
      `}>
        {label}
      </p>
    </div>
  );
}

export default PropertyInput;

