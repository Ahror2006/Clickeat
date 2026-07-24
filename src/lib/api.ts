import axios from "axios";
import { getToken } from "./auth";
import { API_BASE_URL } from "../configs/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Render may need extra time to wake a sleeping free instance.
  timeout: 60_000,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
