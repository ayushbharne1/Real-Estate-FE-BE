import axios from "axios";
import { store } from "../redux/store";
import { setSessionExpired } from "../redux/slices/authSlice";

let isSessionHandled = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401 && !isSessionHandled) {

      isSessionHandled = true;

      // trigger modal
      store.dispatch(setSessionExpired());

    }

    return Promise.reject(error);
  }
);

export default api;