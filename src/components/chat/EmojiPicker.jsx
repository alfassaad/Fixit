import React from 'react';

const EmojiPicker = () => {
  const emojis = ['😀', '😂', '😍', '👍', '🙏', '🎉'];

  return (
    <div className="border rounded-md bg-white shadow-lg p-2">
      <div className="grid grid-cols-6 gap-2">
        {emojis.map((emoji) => (
          <button key={emoji} className="text-2xl">{emoji}</button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
