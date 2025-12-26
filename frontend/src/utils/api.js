import axios from 'axios';
import { serverUrl, tier } from './urlConfig';

// Create an Axios instance with dynamic base URL based on tier
const api = axios.create({
  // Use VITE_API_URL if set, otherwise use serverUrl based on detected tier
  baseURL: import.meta.env?.VITE_API_URL || serverUrl(),
  withCredentials: true,
});

export default api;