import { clsx } from "clsx";
import { useSession } from "next-auth/react"
import Avatar from "./Avatar";
import { format } from "date-fns";
import { FullMessageType } from "../types";

interface BoxProps {
    data: FullMessageType
    isLast?: boolean
}

const MessageBox = ({ data, isLast }: BoxProps) => {
    const session = useSession();
    const isOwn = session.data?.user?.email === data?.sender?.email

    const container = clsx(
        "flex gap-3 p-4",
        isOwn && "justify-end"
    );

    const avatar = clsx(isOwn && "order-2");

    const message = clsx(
        "text-sm w-fit overflow-hidden rounded-full py-2 px-3",
        isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100'
    );

    const body = clsx(
        "flex flex-col gap-2",
        isOwn && "items-end"
    )

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar src="" />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">{data.sender.name}</div>
                    <div className="text-xs text-gray-400">{format(new Date(), 'p')}</div>
                </div>
                <div className={message}>
                    <div>{data.content}</div>
                </div>
            </div>
        </div>
    )
};

export default MessageBox