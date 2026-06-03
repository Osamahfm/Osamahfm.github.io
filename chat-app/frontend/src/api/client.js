import axios from "axios";
import { storage } from "../utils/storage";
import { API_BASE_URL } from "../utils/constants";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: attach JWT ────────────────────────
client.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ──────────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear stored auth
      await storage.clearAll();
    }
    return Promise.reject(error);
  }
);

export default client;
