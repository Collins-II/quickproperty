import React, { useState } from "react";
import { Category, CategoryListData } from "../../Shared/Data";
import Image from "next/image";

interface CategoryListProps {
  onCategoryChange: (categoryValue: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategoryChange }) => {
  const [categoryList] = useState<Category[]>(CategoryListData); // Static data; no updates needed
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div>
      <h2 className="font-bold px-2">Select Property Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {categoryList.slice(0,9).map((item, index) => (
          <div
            key={item.id}
            className={`flex flex-col justify-center items-center bg-gray-100 p-2 m-2 rounded-lg grayscale 
            hover:grayscale-0 cursor-pointer text-[13px] border-purple-400
            ${
              selectedCategory === index
                ? "grayscale-0 border-[1px]"
                : ""
            }`}
            onClick={() => {
              setSelectedCategory(index);
              onCategoryChange(item.value);
            }}
          >
            <item.icon size={40} className={`${
              selectedCategory === index
                ? "text-orange-800]"
                : ""
            }`}/>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
