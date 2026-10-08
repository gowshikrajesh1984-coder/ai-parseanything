export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  avatarUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}
