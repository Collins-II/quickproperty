import { useRef, useState } from "react"
import MessageBox from "../MessageBox"
import { FullMessageType } from "@/app/types"

interface MessageProps {
    initialMessages: FullMessageType[]
};

const ChatBody = ({ initialMessages }: MessageProps) => {
    const [messages, setMessages] = useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message._id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>)
}