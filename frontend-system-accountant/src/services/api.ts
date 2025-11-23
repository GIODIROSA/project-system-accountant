import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-system-accountant.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

//console.log('API Base URL:', api.defaults.baseURL);

export default api;
