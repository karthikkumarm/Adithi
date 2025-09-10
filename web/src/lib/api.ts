import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('payflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('payflow_token');
      localStorage.removeItem('payflow_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

export default api;

// API Functions
export const authAPI = {
  login: (credentials: { email: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  refreshToken: () =>
    api.post('/auth/refresh'),
  
  logout: () =>
    api.post('/auth/logout'),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
};

export const paymentsAPI = {
  processPayment: (data: any) =>
    api.post('/payments/process', data),
  
  getTransactions: (params?: any) =>
    api.get('/payments/transactions', { params }),
  
  getTransaction: (id: string) =>
    api.get(`/payments/transactions/${id}`),
  
  refundPayment: (id: string, data: any) =>
    api.post(`/payments/refund/${id}`, data),
  
  exportTransactions: (params?: any) =>
    api.get('/payments/export', { params }),
};

export const retailersAPI = {
  getRetailers: (params?: any) =>
    api.get('/retailers', { params }),
  
  createRetailer: (data: any) =>
    api.post('/retailers', data),
  
  updateRetailer: (id: string, data: any) =>
    api.put(`/retailers/${id}`, data),
  
  deleteRetailer: (id: string) =>
    api.delete(`/retailers/${id}`),
  
  getRetailerStats: (id: string) =>
    api.get(`/retailers/${id}/stats`),
};

export const analyticsAPI = {
  getDashboardStats: () =>
    api.get('/analytics/dashboard'),
  
  getRevenueChart: (period: string) =>
    api.get(`/analytics/revenue?period=${period}`),
  
  getTransactionStats: () =>
    api.get('/analytics/transactions'),
  
  getRetailerPerformance: () =>
    api.get('/analytics/retailers'),
};

export const payoutAPI = {
  getPayouts: (params?: any) =>
    api.get('/payouts', { params }),
  
  createPayout: (data: any) =>
    api.post('/payouts', data),
  
  updatePayoutStatus: (id: string, status: string) =>
    api.put(`/payouts/${id}/status`, { status }),
};