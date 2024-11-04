'use client'

import { Fragment, useMemo, useState } from "react"
import format from "date-fns/format"
import { IoClose, IoTrash } from 'react-icons/io5'
import { Dialog, Transition } from "@headlessui/react"
import Avatar from "@/app/components/Avatar"
import ConfirmModal from "./ConfirmModal"
import AvatarGroup from "@/app/components/AvatarGroup"
import useOtherUser from "@/app/hooks/useOtherUser"
import useActiveList from "@/app/hooks/useActiveList"
import { IConversation } from "@/app/lib/database/models/conversation.model"
import { IUser } from "@/app/lib/database/models/user.model"

interface ProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: IConversation & {
    users: IUser[]
  }
}

function ProfileDrawer({ isOpen, onClose, data }: ProfileDrawerProps) {
  const otherUser = useOtherUser(data)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { members } = useActiveList()
  const isActive = members.indexOf(otherUser?.email!) !== -1

  /*const joinedDate = useMemo(() => {
    return format(new Date(otherUser?.createdAt), 'PP')
  }, [otherUser?.createdAt])*/

  const title = useMemo(() => {
    return otherUser?.name
  }, [otherUser?.name])

  const statusText = useMemo(() => {
    return isActive ? 'Active' : 'Offline'
  }, [isActive])

  return (
    <>
      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-[#202020] py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-[#303030] text-gray-400 hover:text-gray-500
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {<Avatar src={otherUser?.image as string} />}
                          </div>
                          <div>
                            {title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            <div onClick={() => setConfirmOpen(true)} className="flex flex-col gap-3 items-center cursor-pointer
                             hover:opacity-75">
                              <div className="w-10 h-10 bg-[#303030] rounded-full flex items-center justify-center">
                                <IoTrash size={20} />
                              </div>
                              <div className="text-sm font-light text-neutral-100">
                                Delete
                              </div>
                            </div>
                          </div>
                          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                            {/* Add any additional content here */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ProfileDrawer
