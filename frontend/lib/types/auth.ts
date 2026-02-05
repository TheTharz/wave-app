export interface User {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface UserResponse {
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthError {
  message: string;
  status: number;
}
