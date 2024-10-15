import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://linkb-one.vercel.app', // Replace with your API base URL
});
export default api;