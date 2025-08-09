import axios from 'axios';
import { config } from "./config";
import { analytics } from "./analytics";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponse,
} from "../types/api";

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const startTime = Date.now();
    const sessionInfo = analytics.getSessionInfo();
    if (sessionInfo.correlationId) {
      config.headers["x-correlation-id"] = sessionInfo.correlationId;
    }
    (config as any).startTime = startTime;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const endTime = Date.now();
    const startTime = (response.config as any).startTime || endTime;
    const responseTime = endTime - startTime;
    const correlationId = response.headers["x-correlation-id"];
    if (correlationId) {
      analytics.setCorrelationId(correlationId);
    }
    analytics.trackUserAction("api_call_success", {
      url: response.config.url,
      method: response.config.method,
      statusCode: response.status,
      responseTime,
      dataSize: JSON.stringify(response.data).length,
    });
    return response;
  },
  (error) => {
    const endTime = Date.now();
    const startTime = (error.config as any)?.startTime || endTime;
    const responseTime = endTime - startTime;
    const correlationId = error.response?.headers?.["x-correlation-id"];
    if (correlationId) {
      analytics.setCorrelationId(correlationId);
    }
    analytics.trackUserAction("api_call_error", {
      url: error.config?.url,
      method: error.config?.method,
      statusCode: error.response?.status,
      responseTime,
      errorMessage: error.message,
    });
    analytics.trackError(error, {
      context: "api_call",
      url: error.config?.url,
      method: error.config?.method,
    });
    if (error.response?.data) {
      throw new Error(error.response.data.message || "An error occurred");
    }
    throw new Error(error.message || "Network error");
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