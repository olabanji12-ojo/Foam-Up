import axios from "axios";
import { baseURL } from '../utils/environments';

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,   // ✅ send cookies automatically
});

export default axiosClient;
