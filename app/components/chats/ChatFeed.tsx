import React from 'react';
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import MessageForm from './MessageForm';

interface ChatFeedProps {
  chats: { [key: string]: any };
  activeChat: number;
  userName: string;
  messages: { [key: string]: any };
}

const ChatFeed: React.FC<ChatFeedProps> = ({ chats, activeChat, userName, messages }) => {
  const chat = chats && chats[activeChat];

  const renderReadReceipts = (message: any, isMyMessage: boolean) => (
    chat.people.map((person: any, index: number) => person.last_read === message.id && (
      <div
        key={`read_${index}`}
        className="w-4 h-4 rounded-full bg-cover bg-center"
        style={{
          float: isMyMessage ? 'right' : 'left',
          backgroundImage: person.person.avatar && `url(${person.person.avatar})`,
        }}
      />
    ))
  );

  const renderMessages = () => {
    const keys = Object.keys(messages);

    return keys.map((key, index) => {
      const message = messages[key];
      const lastMessageKey = index === 0 ? '' : keys[index - 1];
      const isMyMessage = userName === message.sender.username;

      return (
        <div key={`msg_${index}`} className="w-full">
          <div className="message-block">
            {isMyMessage
              ? <MyMessage message={message} />
              : <TheirMessage message={message} lastMessage={messages[lastMessageKey]} />}
          </div>
          <div className={`read-receipts ${isMyMessage ? 'mr-4' : 'ml-16'}`}>
            {renderReadReceipts(message, isMyMessage)}
          </div>
        </div>
      );
    });
  };

  if (!chat) return <div />;

  return (
    <div className="chat-feed">
      <div className="chat-title-container">
        <div className="chat-title text-lg font-semibold">{chat?.title}</div>
        <div className="chat-subtitle text-sm text-gray-500">
          {chat.people.map((person: any) => ` ${person.person.username}`).join(',')}
        </div>
      </div>
      {renderMessages()}
      <div className="h-24" />
      <div className="message-form-container">
        <MessageForm chatId={activeChat} creds={activeChat} /> {/*Message Props clarification */}
      </div>
    </div>
  );
};

export default ChatFeed;
