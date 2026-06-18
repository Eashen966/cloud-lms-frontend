import axios from 'axios';

const api = axios.create({
  'https://cloud-lms-backend.onrender.com/api',
});

export default api;
