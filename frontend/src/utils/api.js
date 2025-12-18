import axios from 'axios';

// Create an Axios instance
const api = axios.create({


  // baseURL: 'http://localhost:8080', // Replace with your API base URL
  baseURL: 'https://linkb-one.vercel.app',

  // baseURL: import.meta.env.VITE_API_URL || 'https://clickly.cv',
  // withCredentials: true,
});
export default api;