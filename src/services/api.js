import axios from 'axios';

const api = axios.create({
  // POINT THIS TO YOUR LIVE RENDER SERVER URL
  baseURL: 'https://cloud-lms-backend.onrender.com',
});

export default api;