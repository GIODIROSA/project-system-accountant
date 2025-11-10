import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-system-accountant.onrender.com/api', // url BASE de la API
  headers: {
    'Content-Type': 'application/json',
  },
});

//console.log('API Base URL:', api.defaults.baseURL);

export default api;
