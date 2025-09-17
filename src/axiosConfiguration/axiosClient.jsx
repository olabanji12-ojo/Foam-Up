import axios from "axios";
import { baseURL } from '../utils/environments';

const axiosClient = axios.create({
  baseURL,
});

// Add interceptor to inject token into headers
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
