import axios from "axios";
import { getAuthToken } from "@/utils/authCookie";

const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BAITULLAH,
  timeout: 15000,
});

// Interceptor nambah header Authorization
axiosAuth.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAuth;
