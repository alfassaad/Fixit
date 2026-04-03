import React from 'react';
import { mockChatMessages } from '../../data/mockData';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ roomId }) => {
  const messages = mockChatMessages.filter((msg) => msg.roomId === roomId);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{roomId}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <div className="p-4 border-t">
        <input type="text" placeholder={`Message #${roomId}...`} className="w-full p-2 border rounded-md" />
      </div>
    </div>
  );
};

export default ChatWindow;
