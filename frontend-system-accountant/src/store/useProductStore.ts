import { create } from 'zustand';
import type { Producto } from '../types/Producto';

type ProductState = {
  products: Producto[];
  fetchProducts: () => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  fetchProducts: async () => {
    // const products = await getProducts(); // This would call a service
    // set({ products });
    console.log('Fetching products...');
  },
}));
