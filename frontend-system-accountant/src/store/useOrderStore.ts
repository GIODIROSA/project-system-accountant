import { create } from 'zustand';
import type { Order } from '../types/Order';

type OrderState = {
  orders: Order[];
  fetchOrders: () => Promise<void>;
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  fetchOrders: async () => {
    // const orders = await getOrders(); // This would call a service
    // set({ orders });
    console.log('Fetching orders...');
  },
}));
