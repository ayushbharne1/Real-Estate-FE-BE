import api from "./axiosInstance";

export async function loginApi({ identifier, password }) {
  try {
    const { data } = await api.post("/api/auth/login", {
      identifier,
      password,
    });

    return data.data;
  } catch (err) {
    const json = err.response?.data || {};

    throw {
      message: json.message || `Error ${err.response?.status ?? "Unknown"}`,
      errors: json.errors || {},
    };
  }
}