import axios from 'axios';
// import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: 'https://backend-system-accountant.onrender.com/api', // <-- IMPORTANT: Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', api.defaults.baseURL);

// Request interceptor to add the auth token to headers
// api.interceptors.request.use(
//   (config) => {
//     const token =
    
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;
