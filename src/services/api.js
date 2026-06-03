import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cloud-lms-backend.onrender.com/api', // added /api here!
});

export default api;