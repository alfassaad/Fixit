import React from 'react';
import { mockDMThreads } from '../../data/mockData';

const ChatRoomList = () => {
  return (
    <div className="w-80 bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
      <div>
        <h3 className="font-bold mb-2">Team Channels</h3>
        <ul>
          <li className="p-2 rounded-md bg-gray-300">#general</li>
          <li className="p-2 rounded-md">#roads-dept</li>
          <li className="p-2 rounded-md">#water-dept</li>
          <li className="p-2 rounded-md">#waste-dept</li>
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">Issue Threads</h3>
        <ul>
          <li className="p-2 rounded-md">ISS-001</li>
          <li className="p-2 rounded-md">ISS-002</li>
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="font-bold mb-2">Direct Messages</h3>
        <ul>
          {mockDMThreads.map((thread) => (
            <li key={thread.id} className="p-2 rounded-md">{thread.participantName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoomList;
