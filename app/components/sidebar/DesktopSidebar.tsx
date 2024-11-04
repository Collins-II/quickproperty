"use client";

import { useState } from "react";
import useRoutes from "../../hooks/useRoute";
import DesktopItem from "./DesktopItem";

import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";
import { SafeUser } from "@/app/types";
import { IUser } from "@/app/lib/database/models/user.model";

interface DesktopSidebarProps {
  currentUser: IUser;
}

export default function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
  const routes = useRoutes();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div
        className="
        hidden 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-30 
        lg:w-20 
        xl:px-6
        lg:overflow-y-auto 
        lg:bg-[#ffffff] 
        lg:border-r-[1px]
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
      
      "
      >
        <nav className="mt-4 flex flex-col justify-between pt-28">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center pt-28">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:opacity-75 transition"
          >
            <Avatar src={currentUser?.image as string} />
          </div>
        </nav>
      </div>
    </>
  );
}
