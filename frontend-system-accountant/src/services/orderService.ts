import api from './api';
import type { Order } from '../types/Order';
interface NewOrderPayload {
  total: string;
  id_usuario: number;
  productos: {
    id_producto: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/pedido');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (order: NewOrderPayload): Promise<Order> => {
  try {
    const response = await api.post('/pedido', order);
    console.log('crear el pedido:', response.data);
    return response.data;
  } catch (error: any) { // Use 'any' to access error.response safely
    console.error('Error creating order:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
    }
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
