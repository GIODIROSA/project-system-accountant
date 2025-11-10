import { create } from "zustand";
import { getProducts } from "../services/productService";
import type { ProductoStore } from "../interface/interfaceProduct";

export const useProductoStore = create<ProductoStore>((set) => ({
  productos: [],

  cargarProductos: async () => {
    try {
      const productos = await getProducts();
      console.log("cargar - productos:", productos);  // debugging line
      set({ productos });
    } catch (error) {
      console.error("Error loading products in store:", error);
    }
  },
}));
