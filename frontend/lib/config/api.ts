export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
  },
  estimates: {
    list: '/estimates',
    create: '/estimates',
    detail: (id: number) => `/estimates/${id}`,
    update: (id: number) => `/estimates/${id}`,
    delete: (id: number) => `/estimates/${id}`,
  },
  customers: {
    list: '/customers',
    create: '/customers',
    detail: (id: number) => `/customers/${id}`,
    update: (id: number) => `/customers/${id}`,
    delete: (id: number) => `/customers/${id}`,
  },
  items: {
    list: '/items',
    create: '/items',
    detail: (id: number) => `/items/${id}`,
    update: (id: number) => `/items/${id}`,
    delete: (id: number) => `/items/${id}`,
  },
} as const;

export const TOKEN_KEYS = {
  access: 'wave_access_token',
  refresh: 'wave_refresh_token',
} as const;
