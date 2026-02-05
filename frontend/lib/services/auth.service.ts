import { API_BASE_URL, API_ENDPOINTS, TOKEN_KEYS } from '../config/api';
import type {
  AuthResponse,
  RegisterResponse,
  UserResponse,
  RefreshTokenResponse,
  LogoutResponse,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from '../types/auth';

class AuthService {
  private getAuthHeader(): HeadersInit {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        status: response.status,
      } as AuthError;
    }

    return data as T;
  }

  // Token Management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.access);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEYS.refresh);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.access, accessToken);
    localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
  }

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
  }

  // API Calls
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<RegisterResponse>(response);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse<UserResponse>(response);
  }

  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw {
        message: 'No refresh token available',
        status: 401,
      } as AuthError;
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await this.handleResponse<RefreshTokenResponse>(response);
    
    if (refreshToken) {
      this.setTokens(data.access_token, refreshToken);
    }
    
    return data;
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      const data = await this.handleResponse<LogoutResponse>(response);
      this.clearTokens();
      return data;
    } catch (error) {
      // Clear tokens even if API call fails
      this.clearTokens();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
