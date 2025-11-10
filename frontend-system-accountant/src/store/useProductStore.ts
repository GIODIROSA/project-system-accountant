import { create } from 'zustand';
import {productosMockUp} from '../services/mockup';
import type { ProductoStore } from '../interface/interfaceProduct';


export const useProductoStore = create<ProductoStore>((set) => ({
  productos: [],

  cargarProductos: () => {
    set({ productos: productosMockUp });
  },
}));
