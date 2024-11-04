"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import { sendMessage, isTyping } from 'react-chat-engine';

interface MessageFormProps {
    chatId: number;
    creds: any;
}

const MessageForm: React.FC<MessageFormProps> = ({ chatId, creds }) => {
    const [value, setValue] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        isTyping({ chatId, creds }, chatId);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const text = value.trim();

        if (text.length > 0) {
            sendMessage(creds, chatId, { text });
        }

        setValue('');
    };

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            sendMessage(creds, chatId, { files: event.target.files, text: '' });
        }
    };

    return (
        <form className="flex items-center p-4" onSubmit={handleSubmit}>
            <input
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Send a message..."
                value={value}
                onChange={handleChange}
            />
            <label htmlFor="upload-button" className="mx-2 cursor-pointer">
                <PictureOutlined className="text-xl" />
            </label>
            <input
                type="file"
                multiple={false}
                id="upload-button"
                style={{ display: 'none' }}
                onChange={handleUpload}
            />
            <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <SendOutlined className="text-xl" />
            </button>
        </form>
    );
};

export default MessageForm;
