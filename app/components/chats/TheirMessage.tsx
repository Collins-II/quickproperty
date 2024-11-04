import React from 'react';

interface Message {
    sender: {
        username: string;
        avatar: string;
    };
    text: string;
    attachments?: { file: string }[];
}

interface TheirMessageProps {
    lastMessage: Message | null;
    message: Message;
}

const TheirMessage: React.FC<TheirMessageProps> = ({ lastMessage, message }) => {
    const isFirstMessageByUser = !lastMessage || lastMessage.sender.username !== message.sender.username;

    return (
        <div className="flex mb-4">
            {isFirstMessageByUser && message.sender && (
                <div
                    className="w-8 h-8 rounded-full bg-cover bg-center mr-2"
                    style={{ backgroundImage: `url(${message.sender.avatar})` }}
                />
            )}
            {message.attachments && message.attachments.length > 0 ? (
                <img
                    src={message.attachments[0].file}
                    alt="message-attachment"
                    className={`rounded-lg ${isFirstMessageByUser ? 'ml-1' : 'ml-12'}`}
                />
            ) : (
                <div
                    className={`bg-purple-200 text-gray-800 p-2 rounded-lg ${isFirstMessageByUser ? 'ml-1' : 'ml-12'}`}
                    style={{ float: 'left' }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default TheirMessage;
