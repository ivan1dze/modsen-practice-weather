import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';

interface GoogleLoginButtonProps {
  onSuccess: (token: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      onSuccess(token);
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
  });

  return <button onClick={() => login()}>Login with Google</button>;
};

export default GoogleLoginButton;
