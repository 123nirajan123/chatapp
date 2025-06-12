import React, { useEffect } from 'react';
import { GoogleCredentialResponse } from '../types';

interface GoogleAuthProps {
  onLogin: (credentialResponse: GoogleCredentialResponse) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onLogin }) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "438377522721-fcbvqsl87cu23vcv11arkghln2o5rltd.apps.googleusercontent.com",
        callback: onLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
        }
      );
    }
  }, [onLogin]);

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full flex justify-center"></div>
      <noscript>
        <div className="text-center text-red-500 text-sm mt-2">
          JavaScript is required for Google Sign-In
        </div>
      </noscript>
    </div>
  );
};

export default GoogleAuth;