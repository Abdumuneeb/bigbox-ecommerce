// lib/axios.ts
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const axiosInstances = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach token from cookies to each request
axiosInstances.interceptors.request.use((config) => {
  const token = getCookie("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Store token, name, and email in cookies when received from response
axiosInstances.interceptors.response.use(
  (response) => {
    const { token } = response.data || {};
    const { name, email, _id } = response.data.user || {};

    if (token) {
      setCookie("token", token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    if (name) {
      setCookie("name", name, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    }

    if (email) {
      setCookie("email", email, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    }

    if (_id) {
      setCookie("id", _id, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  },
  (error) => Promise.reject(error)
);
