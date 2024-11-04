"use client"
// components/MyMessage.tsx

import React from 'react';

interface Attachment {
    file: string;
}

interface Message {
    text: string;
    attachments?: Attachment[];
}

interface MyMessageProps {
    message: Message;
}

const MyMessage: React.FC<MyMessageProps> = ({ message }) => {
    if (message.attachments && message.attachments.length > 0) {
        return (
            <img
                src={message.attachments[0].file}
                alt="message-attachment"
                className="float-right max-w-full h-auto"
            />
        );
    }

    return (
        <div className="float-right mr-4 text-white bg-purple-800 p-2 rounded-md">
            {message.text}
        </div>
    );
};

export default MyMessage;
