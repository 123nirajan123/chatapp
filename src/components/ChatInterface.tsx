import React, { useState, useRef, useEffect } from 'react';
import { Send, LogOut, Users, Circle, Hash, Database } from 'lucide-react';
import { User, MessageWithUser } from '../types/database';

interface ChatInterfaceProps {
  user: User;
  messages: MessageWithUser[];
  onSendMessage: (content: string) => void;
  onLogout: () => void;
  isConnected: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  user,
  messages,
  onSendMessage,
  onLogout,
  isConnected,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: MessageWithUser[]) => {
    const groups: { [key: string]: MessageWithUser[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">ChatSpace</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Database className="w-3 h-3" />
              <span>Supabase</span>
              <Circle className={`w-2 h-2 ${isConnected ? 'text-green-500 fill-current' : 'text-red-500'}`} />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">{user.name}</div>
              <div className="flex items-center text-xs text-gray-500">
                <Hash className="w-3 h-3 mr-1" />
                <span>{user.unique_id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>
            
            {dateMessages.map((message, index) => {
              const isCurrentUser = message.user_id === user.id;
              const showAvatar = index === 0 || dateMessages[index - 1].user_id !== message.user_id;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-3 mb-4 ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <img
                          src={message.users.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.users.email}`}
                          alt={message.users.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : ''}`}>
                    {showAvatar && !isCurrentUser && (
                      <div className="flex items-center text-xs text-gray-500 mb-1 px-3 space-x-1">
                        <span className="font-medium">{message.users.name}</span>
                        <Hash className="w-3 h-3" />
                        <span>{message.users.unique_id}</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 px-3 ${
                      isCurrentUser ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                  
                  {isCurrentUser && (
                    <div className="w-8 h-8 flex-shrink-0">
                      {showAvatar && (
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Welcome to ChatSpace!</h3>
            <p className="text-gray-500">Start the conversation by sending your first message.</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        {!isConnected && (
          <div className="text-center mt-2">
            <span className="text-xs text-red-500">Disconnected from server</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;