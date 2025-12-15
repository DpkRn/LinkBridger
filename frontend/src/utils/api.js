import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // baseURL: 'https://linkb-one.vercel.app', // Replace with your API base URL
  // baseURL:'https://clickly.cv'
  // baseURL: 'http://localhost:8080', // Replace with your API base URL
  baseURL: import.meta.env.VITE_API_URL || 'https://clickly.cv',
  withCredentials: true,
});
export default api;