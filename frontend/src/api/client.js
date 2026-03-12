import axios from 'axios';

const inferApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL;
  if (configuredApiUrl) return configuredApiUrl;

  const { protocol, hostname, origin } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5140/api';
  }

  // Helpful fallback for default Render service names used in this repository.
  if (hostname.endsWith('.onrender.com')) {
    return `${protocol}//employee-registry-api.onrender.com/api`;
  }

  // Generic fallback when frontend and backend are served behind same host/reverse-proxy.
  return `${origin}/api`;
};

const API_BASE_URL = inferApiBaseUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token to requests
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url ?? '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
