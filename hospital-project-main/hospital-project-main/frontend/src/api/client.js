import axios from 'axios';

const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/$/, '');

const resolveBaseUrl = () => {
  const envBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const isLocalBrowser = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (!isLocalBrowser) {
    return envBaseUrl || '/api';
  }

  // In local development, prefer localhost API even when a stale global VITE_API_URL is set.
  if (envBaseUrl && /localhost|127\.0\.0\.1/i.test(envBaseUrl)) {
    return envBaseUrl;
  }

  return 'http://localhost:5000/api';
};

const client = axios.create({
  baseURL: resolveBaseUrl(),
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
