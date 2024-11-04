"use client";

import { IUser } from "@/app/lib/database/models/user.model";
import UserBox from "./UserBox";

interface UserListProps {
  items: IUser[];
};

export default function UserList({ items }: UserListProps) {
  console.log("USER_ITEMS", items)
  return (
    <aside className="fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 blocl w-full left-0 pt-32">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-300 py-4">People</div>
        </div>
        {items.map((item) => (
          <UserBox key={item._id} data={item} />
        ))}
      </div>
    </aside>
  );
}
