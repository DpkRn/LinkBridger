import axios from 'axios';

// Create an Axios instance
const api = axios.create({
 
  // baseURL: 'http://localhost:8080', // Replace with your API base URL
  baseURL: import.meta.env.VITE_API_URL || 'https://clickly.cv',
  withCredentials: true,
  // baseURL:'https://backend:8080'
});
export default api;