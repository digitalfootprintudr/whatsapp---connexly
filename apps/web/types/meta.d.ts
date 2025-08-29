declare global {
  interface Window {
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (callback: (response: any) => void, options?: any) => void;
      api: (path: string, method: string, params: any, callback: (response: any) => void) => void;
      getLoginStatus: (callback: (response: any) => void) => void;
      logout: (callback: (response: any) => void) => void;
    };
  }
}

export interface MetaEmbeddedSignupResponse {
  signupUrl: string;
  sessionId: string;
}

export interface OnboardingPayload {
  businessName: string;
  phoneNumber: string;
  displayName: string;
  portfolioId: string;
  wabaId: string;
  accessToken?: string;
  webhookUrl?: string;
  webhookVerifyToken?: string;
}

export interface MetaSDKConfig {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}
