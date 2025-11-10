import api from './api';
import type { Producto } from '../interface/interfaceProduct';

export const getProducts = async (): Promise<Producto[]> => {
  try {
    const response = await api.get('/producto');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Producto, 'id_producto' | 'createdAt'>): Promise<Producto> => {
  try {
    const response = await api.post('/producto', product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, product: Partial<Producto>): Promise<Producto> => {
  try {
    const response = await api.put(`/producto/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/producto/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};
