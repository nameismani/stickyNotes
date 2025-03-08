export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string; // Only used during registration/login, not stored in state
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type SignInFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
