'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/lib/pusher"
import { find } from "lodash"

interface BodyProps {
  initialMessages: FullMessageType[]
}

export default function Body({ initialMessages }: BodyProps) {
  console.log("BODY_MESSAGE", initialMessages)
  const [messages, setMessages] = useState<FullMessageType[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView()

    const messagesHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      setMessages((current) => {
        if (find(current, { _id: message?._id })) {
          return current
        }

        // Ensure `current` is always an array
        return [...(current || []), message]
      })

      bottomRef?.current?.scrollIntoView()
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current?.map((currentMessage) => {
        if (currentMessage._id === newMessage._id) {
          return newMessage
        }
        return currentMessage
      }) || [])
    }

    pusherClient.bind('messages:new', messagesHandler)
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messagesHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <MessageBox
          isLast={i === messages?.length - 1}
          key={message?._id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  )
}
