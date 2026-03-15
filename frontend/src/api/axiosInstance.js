import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      alert("Session expired. Please login again.");

      store.dispatch(logoutUser());

      localStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;