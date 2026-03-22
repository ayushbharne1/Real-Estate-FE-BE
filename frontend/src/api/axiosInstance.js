import axios from "axios";
import store from "../redux/store";
import { setSessionExpired } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const state = store.getState();
      // Only dispatch if not already expired — read from store, no mutable var
      if (!state.auth.sessionExpired && state.auth.isAuthenticated) {
        store.dispatch(setSessionExpired());
      }
    }
    return Promise.reject(error);
  }
);

export const resetSessionHandler = () => {};
export default api;