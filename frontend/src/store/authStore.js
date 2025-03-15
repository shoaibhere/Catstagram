import { create } from "zustand";
import axios from "axios";

const API_URL = "https://catstagram-production.up.railway.app/api/user";
axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userInfo"))?.user || null,
  token: localStorage.getItem("token") || getCookie("token"),
  isAuthenticated: !!(localStorage.getItem("token") || getCookie("token")),
  isLoading: false,
  error: null,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });

      const token = response.data.token;
      const user = response.data.user;

      storeToken(token);
      localStorage.setItem("userInfo", JSON.stringify({ user }));

      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      const token = response.data.token;
      const user = response.data.user;

      storeToken(token);
      localStorage.setItem("userInfo", JSON.stringify({ user }));

      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Invalid Email or Password", isLoading: false });
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem("token") || getCookie("token");
    const user = JSON.parse(localStorage.getItem("userInfo"))?.user;

    if (token && user) {
      set({ user, token, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    deleteCookie("token");

    set({ user: null, token: null, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error sending reset password email", isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error resetting password", isLoading: false });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const token = localStorage.getItem("token") || getCookie("token");
      const response = await axios.post(
        `${API_URL}/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ message: "Password changed successfully", isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to change password", isLoading: false });
    }
  },

  clearMessages: () => set({ error: null, message: null }),
}));

// Utility functions for handling cookies
function storeToken(token) {
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=None;`;
  localStorage.setItem("token", token);
}

function getCookie(name) {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return cookie ? cookie.split("=")[1] : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=None;`;
}
