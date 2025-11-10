import { create } from 'zustand';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import type { ProductoStore } from '../interface/interfaceProduct';
import type { Producto } from '../interface/interfaceProduct';

export const useProductoStore = create<ProductoStore>((set) => ({
  productos: [],

  cargarProductos: async () => {
    try {
      const productos = await getProducts();
      set({ productos });
    } catch (error) {
      console.error('Error loading products in store:', error);
    }
  },

  addProduct: async (newProduct: Omit<Producto, 'id_producto' | 'createdAt'>) => {
    try {
      const createdProduct = await createProduct(newProduct);
      set((state) => ({
        productos: [...state.productos, createdProduct],
      }));
    } catch (error) {
      console.error('Error adding product in store:', error);
    }
  },

  updateProduct: async (id: number, updatedProduct: Partial<Producto>) => {
    try {
      const product = await updateProduct(id, updatedProduct);
      set((state) => ({
        productos: state.productos.map((p) => (p.id_producto === id ? product : p)),
      }));
    } catch (error) {
      console.error(`Error updating product ${id} in store:`, error);
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await deleteProduct(id);
      set((state) => ({
        productos: state.productos.filter((p) => p.id_producto !== id),
      }));
    } catch (error) {
      console.error(`Error deleting product ${id} in store:`, error);
    }
  },
}));
