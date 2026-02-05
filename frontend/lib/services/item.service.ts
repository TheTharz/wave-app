import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { authService } from './auth.service';
import type { ItemsResponse } from '../types/item';

class ItemService {
  private getAuthHeader(): HeadersInit {
    const token = authService.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        status: response.status,
      };
    }

    return data as T;
  }

  async getItems(page: number = 1, perPage: number = 20): Promise<ItemsResponse> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.items.list}?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      }
    );

    return this.handleResponse<ItemsResponse>(response);
  }
}

export const itemService = new ItemService();
