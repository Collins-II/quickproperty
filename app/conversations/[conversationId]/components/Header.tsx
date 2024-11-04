'use client'
import Avatar from "@/app/components/Avatar"
import useOtherUser from "@/app/hooks/useOtherUser"
import Link from "next/link"
import { useMemo, useState } from "react"
import { HiChevronLeft } from "react-icons/hi"
import { HiEllipsisHorizontal } from "react-icons/hi2"
import ProfileDrawer from "./ProfileDrawer"
import AvatarGroup from "@/app/components/AvatarGroup"
import useActiveList from "@/app/hooks/useActiveList"
import { IConversation } from "@/app/lib/database/models/conversation.model"
import { IUser } from "@/app/lib/database/models/user.model"



interface HeaderProps {
  conversation: IConversation & {
    users: IUser[]
  }
}

export default function Header({ conversation }: HeaderProps) {

  const otherUser = useOtherUser(conversation)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { members } = useActiveList()
  const isActive = members.indexOf(otherUser?.email!) !== -1

  const statusText = useMemo(() => {

    return isActive ? 'Active' : 'Offline'
  }, [conversation, isActive])

  return (
    <>
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="bg-[#303030] text-neutral-100 w-full flex justify-between items-center shadow-sm border-b sm:px-4 px-4 py-3 lg:px-6">
        <div className="flex gap-3 items-center">
          <Link className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
            href='/conversations'>
            <HiChevronLeft size={32} />
          </Link>
          <Avatar src={otherUser?.image as string} />
          <div className="flex flex-col">
            <div>
              {otherUser?.name}
            </div>
            <div className="text-sm font-light text-neutral-300">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal className="text-sky-500 cursor-pointer hover:text-sky-600 transition" size={32} onClick={() => setDrawerOpen(true)} />
      </div>
    </>
  )
}