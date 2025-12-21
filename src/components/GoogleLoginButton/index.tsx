import './style.css';

import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';

interface GoogleAuthButtonProps {
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onLoginSuccess,
  onLogout,
}) => {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse: { access_token: string }) => {
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
        <button className="googlebuttonlogin" onClick={handleLogout}>
          <span>🚪</span>
          <span>{t('exit')}</span>
        </button>
      ) : (
        <button className="googlebuttonlogin" onClick={() => login()}>
          <span>🔐</span>
          <span>{t('signIn')}</span>
        </button>
      )}
    </>
  );
};

export default GoogleAuthButton;
