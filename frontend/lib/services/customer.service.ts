import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { authService } from './auth.service';
import type { CustomersResponse } from '../types/customer';

class CustomerService {
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

  async getCustomers(page: number = 1, perPage: number = 20): Promise<CustomersResponse> {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.customers.list}?page=${page}&per_page=${perPage}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      }
    );

    return this.handleResponse<CustomersResponse>(response);
  }
}

export const customerService = new CustomerService();
