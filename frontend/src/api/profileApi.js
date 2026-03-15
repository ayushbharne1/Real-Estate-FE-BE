import api from "./axiosInstance";

export async function getMeApi() {
  try {
    const { data } = await api.get("/auth/me");

    return data.data;
  } catch (err) {
    const json = err.response?.data || {};

    throw {
      message: json.message || `Error ${err.response?.status ?? "Unknown"}`,
    };
  }
}