import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
  baseURL: "https://clickeat-5wy1.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});