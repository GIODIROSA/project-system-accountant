import api from './api';

export const login = async (password: string) => {
  // You might need to send a username or email as well
  const response = await api.post('/auth/login', { password });
  return response.data; // Should return something like { token: '...' }
};
