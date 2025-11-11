import api from './api';
import type { User } from '../types/Users';

export const createUser = async (user: Omit<User, 'id_usuario' | 'createdAt'>): Promise<User> => {
  try {
    const response = await api.post('/usuario', user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await api.get(`/usuario/email/${encodedEmail}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error fetching user by email:', error);
    throw error;
  }
};
