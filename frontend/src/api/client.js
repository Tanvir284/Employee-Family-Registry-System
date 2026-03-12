import axios from 'axios';

const API_BASE_URL_STORAGE_KEY = 'apiBaseUrlOverride';

const getStoredApiBaseUrl = () => localStorage.getItem(API_BASE_URL_STORAGE_KEY)?.trim();

const inferApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredApiUrl) return configuredApiUrl;

  const storedApiUrl = getStoredApiBaseUrl();
  if (storedApiUrl) return storedApiUrl;

  const { protocol, hostname, origin } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5140/api';
  }

  if (hostname.endsWith('.onrender.com')) {
    const siblingByToken = hostname
      .replace('-frontend', '-api')
      .replace('frontend', 'api');

    return `${protocol}//${siblingByToken}/api`;
  }

  return `${origin}/api`;
};

const buildApiCandidates = () => {
  const { protocol, hostname, origin } = window.location;
  const configured = import.meta.env.VITE_API_URL?.trim();
  const stored = getStoredApiBaseUrl();

  const candidates = [configured, stored, `${origin}/api`];

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    candidates.push('http://localhost:5140/api');
  }

  if (hostname.endsWith('.onrender.com')) {
    const siblingByToken = hostname
      .replace('-frontend', '-api')
      .replace('frontend', 'api');

    candidates.push(`${protocol}//${siblingByToken}/api`);
    candidates.push(`${protocol}//employee-registry-api.onrender.com/api`);
  }

  return [...new Set(candidates.filter(Boolean))];
};

const client = axios.create({
  baseURL: inferApiBaseUrl(),
});

export const setApiBaseUrl = (url, persist = true) => {
  client.defaults.baseURL = url;
  if (persist) {
    localStorage.setItem(API_BASE_URL_STORAGE_KEY, url);
  }
};

export const resolveReachableApiBaseUrl = async () => {
  const candidates = buildApiCandidates();

  for (const candidate of candidates) {
    try {
      const response = await axios.get(`${candidate}/auth/health`, {
        timeout: 5000,
        validateStatus: () => true,
      });

      if (response.status >= 200 && response.status < 500) {
        setApiBaseUrl(candidate, true);
        return candidate;
      }
    } catch {
      // try next
    }
  }

  return null;
};

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
