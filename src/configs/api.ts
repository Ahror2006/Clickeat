const DEFAULT_API_URL = "https://clickeat-5wy1.onrender.com";

export const API_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

export const API_BASE_URL = `${API_URL}/api`;
