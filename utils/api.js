// utils/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://api.geekifypeople.geekify.global";

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "client-secret": "secret", // ✅ Added here
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    const parsed = JSON.parse(token);
    if (parsed?.accessToken) {
      config.headers.Authorization = `${parsed.tokenType || "Bearer"} ${
        parsed.accessToken
      }`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([
        "authUser",
        "authFranchisee",
        "authToken",
        "authPermissions",
      ]);
      // You can handle navigation to login here if needed
      // e.g., router.replace("/login")
    }
    return Promise.reject(error);
  }
);

export default api;
