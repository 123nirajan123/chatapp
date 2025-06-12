import React, { useState } from 'react';
import { MessageCircle, Users, Zap } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import { GoogleCredentialResponse } from '../types';

interface LoginScreenProps {
  onLogin: (credentialResponse: GoogleCredentialResponse) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async (credentialResponse: GoogleCredentialResponse) => {
    setIsLoading(true);
    try {
      await onLogin(credentialResponse);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Google login failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ChatSpace</h1>
          <p className="text-gray-600 mb-6">Connect with everyone in real-time</p>
          
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Real-time</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-500" />
              <span>Group Chat</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <GoogleAuth onLogin={handleGoogleLogin} />
          
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Sign in with Google to continue</p>
            <p className="mt-2 text-xs">Powered by Supabase for real-time messaging</p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-500 mt-2">Connecting to ChatSpace...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;