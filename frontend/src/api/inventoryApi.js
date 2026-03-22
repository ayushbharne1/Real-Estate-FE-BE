import api from "./axiosInstance";
import { getCached, setCached } from './cache'

// ─── helpers ─────────────────────────────

export function buildFormData(values, imageFiles = [], videoFile = null, existingImages = null) {
  const fd = new FormData();

  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined || val === null || val === "") return;

    if (Array.isArray(val)) {
      fd.append(key, JSON.stringify(val));
    } else {
      fd.append(key, val);
    }
  });

  imageFiles.forEach((f) => fd.append("images", f));

  if (videoFile) fd.append("video", videoFile);

  if (existingImages !== null) {
    fd.append("existingImages", JSON.stringify(existingImages));
  }

  return fd;
}

// ─── API functions ───────────────────────

export async function fetchProperties(params = {}) {
  const key = 'assetCounts:' + JSON.stringify(params)
  const cached = getCached(key)
  if (cached) return cached
  try {
    const { data } = await api.get("/inventory", { params });
    setCached(key, data.data)
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function fetchProperty(id) {

  try {
    const { data } = await api.get(`/inventory/${id}`);
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function fetchSimilarProperties(id) {
  try {
    const { data } = await api.get(`/inventory/${id}/similar`);
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function createProperty(formData) {
  try {
    const { data } = await api.post("/inventory", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function updateProperty(id, formData) {
  try {
    const { data } = await api.put(`/inventory/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function deleteProperty(id) {
  try {
    const { data } = await api.delete(`/inventory/${id}`);
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

export async function fetchAssetTypeCounts(params) {
  const key = 'assetCounts:' + JSON.stringify(params)
  const cached = getCached(key)
  if (cached) return cached
  try {
    const { data } = await api.get("/inventory/asset-type-counts", {
      params: params || {},
    });
    setCached(key, data.data)
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

function _normalise(err) {
  const json = err.response?.data || {};

  return {
    message: json.message || `Error ${err.response?.status ?? "Unknown"}`,
    errors: json.errors || {},
  };
}