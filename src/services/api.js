import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cloud-lms-backend.onrender.com/api',
});

export default api;
