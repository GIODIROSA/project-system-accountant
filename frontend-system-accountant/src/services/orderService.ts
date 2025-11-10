import api from './api';
import type { Order } from '../types/Order';

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/pedido');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (order: Omit<Order, 'id_pedido' | 'createdAt'>): Promise<Order> => {
  try {
    const response = await api.post('/pedido', order);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<Order> => {
  try {
    const response = await api.put(`/pedido/${id}`, order);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
};

export const deleteOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/pedido/${id}`);
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};
