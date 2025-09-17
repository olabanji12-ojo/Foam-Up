import axios from "axios";
import { baseURL } from "../utils/environments";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // 👈 send cookies with every request
});

// You don’t need the localStorage interceptor anymore
// Cookies will be sent automatically by axios

export default axiosClient;
