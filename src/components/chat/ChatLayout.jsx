import React from 'react';

const ChatLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default ChatLayout;