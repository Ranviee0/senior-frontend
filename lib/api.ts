// lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // use NEXT_PUBLIC_ prefix
  withCredentials: true, // optional: for cookies/session handling
});

export default api;
