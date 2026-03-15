import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../api/authApi";

// ── Async Thunk ─────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ identifier, password });

      // Save login data
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      return data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
});

// ── Initial State ───────────────────────────────────────────

const storedAdmin = localStorage.getItem("admin");

const initialState = {
  admin: storedAdmin ? JSON.parse(storedAdmin) : null,
  token: localStorage.getItem("token") || null,

  loading: false,
  error: null,
  fieldErrors: {},

  isAuthenticated: !!localStorage.getItem("token"),

  // ⭐ used to show session expired modal
  sessionExpired: false,
};

// ── Slice ───────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearErrors(state) {
      state.error = null;
      state.fieldErrors = {};
    },

    // ⭐ triggered when backend returns 401
    setSessionExpired(state) {
      state.sessionExpired = true;
    },

    clearSessionExpired(state) {
      state.sessionExpired = false;
    },
  },

  extraReducers: (builder) => {

    // ── Login ─────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = {};
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.token = action.payload.token;
        state.admin = action.payload.admin;

        state.isAuthenticated = true;
        state.sessionExpired = false;

        state.error = null;
        state.fieldErrors = {};
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.token = null;
        state.admin = null;
        state.isAuthenticated = false;

        const payload = action.payload;

        if (payload?.errors) {
          state.fieldErrors = payload.errors;
        }

        state.error = payload?.message || "Login failed. Please try again.";
      });

    // ── Logout ────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;

      state.error = null;
      state.fieldErrors = {};

      state.sessionExpired = false;
    });
  },
});

// ── Exports ─────────────────────────────────────────────────

export const {
  clearErrors,
  setSessionExpired,
  clearSessionExpired,
} = authSlice.actions;

export default authSlice.reducer;

// ── Selectors ───────────────────────────────────────────────

export const selectAuth = (state) => state.auth;

export const selectAdmin = (state) => state.auth.admin;

export const selectToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export const selectFieldErrors = (state) => state.auth.fieldErrors;

export const selectSessionExpired = (state) => state.auth.sessionExpired;