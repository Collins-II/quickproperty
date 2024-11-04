'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";
import { cn } from "../lib/utils";
import { clsx } from "clsx";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser
  });

  return (
    <div
      onClick={toggleFavorite}
      className="
    p-2 
    rounded-full 
    shadow-md 
    bg-blue-100 
        hover:bg-white
    transition-all 
    duration-200
    flex 
    items-center 
    justify-center
  "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={clsx(`w-4 h-4  `,
          hasFavorited ? "text-red-600" : "fill-slate-900")}
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4.004 4.004 0 015.656 0L12 8.344l3.172-3.172a4.004 4.004 0 115.656 5.656L12 19.656 3.172 10.828a4.004 4.004 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default HeartButton;
