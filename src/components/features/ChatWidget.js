import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ChatWidget = ({ isOpen, toggleOpen, currentUserId, otherUserId, db, setDb, title }) => {
  const [msgText, setMsgText] = useState('');

  // 1. Filter Messages for this specific conversation
  const conversation = (db.messages || []).filter(m => 
    (m.from === currentUserId && m.to === otherUserId) || 
    (m.from === otherUserId && m.to === currentUserId)
  );

  const handleSend = () => {
    if (!msgText.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: currentUserId,
      to: otherUserId,
      text: msgText,
      timestamp: new Date().toLocaleTimeString()
    };
    // Update Global State
    setDb(prev => ({ ...prev, messages: [...(prev.messages || []), newMsg] }));
    setMsgText('');
  };

  if (!isOpen) return null;

  return (
    <Modal title={`Chat with ${title}`} onClose={toggleOpen}>
      <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-50 rounded space-y-2">
        {conversation.length === 0 && <p className="text-gray-400 text-center text-sm mt-10">No messages yet.</p>}
        {conversation.map(msg => {
          const isMe = msg.from === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-2 rounded-lg text-sm ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.text}</p>
                <span className="text-[10px] opacity-75 block text-right">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input 
          className="flex-1 border p-2 rounded" 
          value={msgText} 
          onChange={(e) => setMsgText(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Modal>
  );
};

export default ChatWidget;
