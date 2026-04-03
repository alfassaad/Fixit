import React from 'react';

const MessageBubble = ({ message }) => {
  const { senderName, senderRole, message: text, time } = message;

  return (
    <div className="flex mb-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
      <div>
        <div className="flex items-center mb-1">
          <span className="font-bold mr-2">{senderName}</span>
          <span className="text-gray-500 text-sm">{senderRole}</span>
        </div>
        <div className="bg-gray-200 p-3 rounded-lg">
          <p>{text}</p>
        </div>
        <span className="text-gray-500 text-xs mt-1">{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
