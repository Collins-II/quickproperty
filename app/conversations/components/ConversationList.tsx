"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";
import { IUser } from "@/app/lib/database/models/user.model";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: IUser[];
}

export default function ConversationList({ initialItems, users }: ConversationListProps) {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => session?.data?.user?.email, [session?.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation._id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current: any) =>
        current.map((currentConversation: any) =>
          currentConversation.id === conversation._id
            ? { ...currentConversation, messages: conversation.messages }
            : currentConversation
        )
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => current.filter((convo) => convo.id !== conversation._id));
      if (conversationId === conversation._id) {
        router.push('/conversations');
      }
    };

    pusherClient.subscribe(pusherKey);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:remove', removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed bg-red-500 rounded-lg inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 bg-[#fff]`,
          isOpen ? "hidden" : "block w-full left-0 pt-0"
        )}
      >
        <div className="px-5 pt-32">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-100">Messages</div>
            <div
              className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items?.map((item) => (
            <ConversationBox
              key={item._id}
              data={item}
              selected={conversationId === item._id}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
