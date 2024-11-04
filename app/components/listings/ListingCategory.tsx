'use client';

import { IconType } from "react-icons";

interface CategoryViewProps {
  icon: IconType,
  label: string,
  description: string
}

const CategoryView: React.FC<CategoryViewProps> = ({
  icon: Icon,
  label,
  description
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2 ">
        <div className='p-3 bg-neutral-100 text-blue-400 flex items-center justify-center rounded-full'>
          <Icon size={18} />
        </div>
        <div className="flex flex-col">
          <div
            className="text-sm lg:text-1xl font-semibold text-neutral-500"
          >
            {label}
          </div>
          {/*  <div
            className="text-neutral-500 font-light"
          >
            {description}
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default CategoryView;