import './style.css';

import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';

interface GoogleAuthButtonProps {
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onLoginSuccess,
  onLogout,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      onLoginSuccess(token);
      setIsLoggedIn(true);
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  const handleLogout = () => {
    googleLogout();
    setIsLoggedIn(false);
    onLogout();
  };

  return (
    <>
      {isLoggedIn ? (
        <button className={'googlebuttonlogin'} onClick={handleLogout}>
          Exit
        </button>
      ) : (
        <button className={'googlebuttonlogin'} onClick={() => login()}>
          Sign In
        </button>
      )}
    </>
  );
};

export default GoogleAuthButton;
