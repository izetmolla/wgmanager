export interface AuthorizationTypes {
  auth_redirect?: string | null;
  isLoading?: boolean;
  isLoggedin?: boolean;
  user?: any;
  tokens: {
    access_token: any;
    refresh_token: any;
  };
  error?: null | { message: string; path: string };
}
