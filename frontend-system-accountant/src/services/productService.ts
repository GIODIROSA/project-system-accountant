import api from './api';
import type { Producto } from '../types/Producto';

export const getProducts = async (): Promise<Producto[]> => {
  const response = await api.get('/producto');
  return response.data;
};
