import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * A single, shared Axios instance used across the whole app. This is the
 * only place that knows the API base URL and how to attach the JWT, so
 * no component needs to repeat that configuration.
 */
const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Before every request, attach the JWT (if one is stored) as a Bearer
 * token. Reading directly from localStorage here keeps this file
 * self-contained; AuthContext is the source of truth for React state,
 * but Axios interceptors run outside of React.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;