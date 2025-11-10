import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-system-accountant.onrender.com/api', // <-- IMPORTANT: Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', api.defaults.baseURL);

export default api;
