import axios from "axios";

export const api = axios.create({
  baseURL: "https://clickeat-5wy1.onrender.com/api",
});