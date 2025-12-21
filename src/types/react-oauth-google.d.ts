declare module '@react-oauth/google' {
  import { ComponentType, ReactNode } from 'react';

  export interface TokenResponse {
    access_token: string;
    expires_in?: number;
    scope?: string;
    token_type?: string;
  }

  export interface UseGoogleLoginOptions {
    onSuccess?: (tokenResponse: TokenResponse) => void;
    onError?: () => void;
    scope?: string;
    flow?: 'auth-code' | 'implicit';
    overrideScope?: boolean;
    selectAccount?: boolean;
    prompt?: string;
    state?: string;
    hostedDomain?: string;
    uxMode?: 'popup' | 'redirect';
    redirectUri?: string;
    autoSelect?: boolean;
    itpSupport?: boolean;
    nonce?: string;
  }

  export function useGoogleLogin(options: UseGoogleLoginOptions): () => void;

  export function googleLogout(): void;

  export interface GoogleOAuthProviderProps {
    clientId: string;
    children: ReactNode;
  }

  export const GoogleOAuthProvider: ComponentType<GoogleOAuthProviderProps>;
}
