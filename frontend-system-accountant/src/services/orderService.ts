import api from './api';
import type { Order } from '../types/Order';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.data;
};
