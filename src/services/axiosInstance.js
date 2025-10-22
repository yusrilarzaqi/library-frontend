import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Attach token from localStorage
instance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = JSON.parse(user).token;
    if (user) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle token expiration
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Handle errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  },
);

export default instance;
