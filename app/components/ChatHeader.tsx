"use client";

import { useMemo } from "react";
import { IConversation } from "../lib/database/models/conversation.model";
import { IListing } from "../lib/database/models/listing.model";
import { IUser } from "../lib/database/models/user.model";
import Avatar from "./Avatar";

interface ChatHeaderProps {
    conversation: IConversation & {
        users: IUser[],
        listing: IListing
    }
};

const ChatHeader = ({ conversation }: ChatHeaderProps) => {
    const otherUser = {
        image: ""
    }

    const statusText = useMemo(() => {
        return "Active"
    }, [conversation])

    return (
        <div
            className="
w-full
flex
items-center
justify-between
sm:px-4
py-3
px-4
shadow-sm
border-b-[1px]
"
        >
            <div
                className="flex gap-3 items-center"
            >
                <Avatar src={otherUser.image} />
            </div>

        </div>
    );
};

export default ChatHeader;