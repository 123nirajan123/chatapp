import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  const { user, login, logout, isLoading } = useAuth();
  const { messages, sendMessage, isConnected } = useChat(user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading ChatSpace...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to Supabase...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <ChatInterface
      user={user}
      messages={messages}
      onSendMessage={sendMessage}
      onLogout={logout}
      isConnected={isConnected}
    />
  );
}

export default App;