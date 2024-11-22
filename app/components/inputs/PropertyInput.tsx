'use client';

import { ReactNode } from 'react';

interface PropertyInputProps {
  icon: ReactNode; // ReactNode to accept the icon as JSX
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
        rounded-lg
        border-2
        w-[100px]
        h-[130px]
        px-1
        py-2
        relative
        flex
        flex-col
        justify-center
        items-center
        gap-2
        shadow-md
        hover:shadow-lg
        hover:scale-105
        transition-transform
        cursor-pointer
        bg-neutral-100
        ${selected ? 'border-slate-600 bg-slate-50' : 'border-gray-300'}
      `}
    >
      {/* Render the icon */}
      <div className="text-4xl text-slate-500 mb-2">
        {icon}
      </div>

      <p
        className={`
          font-semibold 
          text-sm 
          text-gray-700 
          bg-gradient-to-r from-slate-500 to-teal-500
          text-transparent
          bg-clip-text
          px-2 
          py-1 
          rounded-md 
          max-w-full 
          text-center 
          overflow-hidden 
          text-ellipsis 
          whitespace-nowrap
        `}
      >
        {label}
      </p>
    </div>
  );
}

export default PropertyInput;
