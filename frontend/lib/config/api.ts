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
} as const;

export const TOKEN_KEYS = {
  access: 'wave_access_token',
  refresh: 'wave_refresh_token',
} as const;
