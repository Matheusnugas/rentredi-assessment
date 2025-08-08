interface Config {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

const getApiBaseUrl = (): string => {
  // Check for environment variable first (Docker container networking or production)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Development: use proxy (relative URL) - this gets proxied to localhost:8080
  if (import.meta.env.DEV) {
    return '/api';
  }

  // Fallback: default to localhost:8080
  return 'http://localhost:8080/api';
};

export const config: Config = {
  apiBaseUrl: getApiBaseUrl(),
  environment: import.meta.env.MODE as Config['environment'],
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  isTest: import.meta.env.MODE === 'test',
};

if (config.isDevelopment) {
  console.log('🔧 Frontend Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    environment: config.environment,
  });
} 