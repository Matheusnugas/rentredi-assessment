import axios from 'axios';
import { config } from "./config";
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  ApiResponse 
} from '../types/api';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw new Error(error.message || 'Network error');
  }
);

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/users');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  create: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', userData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  update: async (id: string, userData: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, userData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  delete: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<{ deleted: boolean }>>(`/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },
};

export default api; 