// shared/constants/app.js
// API routes, validation limits, upload config, UI defaults.

const API_ROUTES = {
  AUTH: {
    LOGIN:   "/api/auth/login",
    LOGOUT:  "/api/auth/logout",
    ME:      "/api/auth/me",
  },
  PROPERTIES: {
    LIST:    "/api/properties",
    DETAIL:  (id) => `/api/properties/${id}`,
    SIMILAR: (id) => `/api/properties/${id}/similar`,
  },
  INVENTORY: {
    CREATE: "/api/inventory",
  },
  UPLOAD: {
    IMAGES: "/api/upload/images",
  },
  CONFIG: {
    ASSET_TYPES: "/api/config/asset-types",
    CITIES:      "/api/config/cities",
    STATES:      "/api/config/states",
    POSSESSION:  "/api/config/possession",
    AMENITIES:   "/api/config/amenities",
  },
};

const APP_ROUTES = {
  LOGIN:           "/login",
  DASHBOARD:       "/dashboard",
  PROPERTY_DETAIL: (id) => `/property/${id}`,
  INVENTORY_ADD:   "/inventory/add",
};

const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
};

const VALIDATION = {
  PROPERTY_NAME:   { MIN: 3,  MAX: 200 },
  DESCRIPTION:     { MIN: 20, MAX: 2000 },
  PINCODE_LENGTH:  6,
  PASSWORD_MIN:    6,
  PRICE_MAX:       999999999,
  AREA_MAX:        999999,
  SBUA_FILTER_MAX: 1000,
  BEDROOM_MAX:     20,
  BATHROOM_MAX:    20,
  BALCONY_MAX:     10,
};

const UPLOAD = {
  IMAGE_MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  IMAGE_MIN_COUNT:      1,
  IMAGE_MAX_COUNT:      15,
  ALLOWED_IMAGE_TYPES:  ["image/jpeg", "image/png", "image/webp"],
};

const SESSION_KEYS = {
  USER: "ir_user",
};

const UI = {
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION_MS:  3500,
};

const REGEX = {
  EMAIL:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PINCODE: /^\d{6}$/,
};

export  {
  API_ROUTES, APP_ROUTES, PAGINATION,
  VALIDATION, UPLOAD, SESSION_KEYS, UI, REGEX,
};