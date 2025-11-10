import { create } from 'zustand';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import type { Order } from '../types/Order';

interface OrderStore {
  orders: Order[];
  cargarPedidos: () => Promise<void>;
  addPedido: (newOrder: Omit<Order, 'id_pedido' | 'createdAt'>) => Promise<void>;
  updatePedido: (id: number, updatedOrder: Partial<Order>) => Promise<void>;
  deletePedido: (id: number) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  cargarPedidos: async () => {
    try {
      const orders = await getOrders();
      set({ orders });
    } catch (error) {
      console.error('Error loading orders in store:', error);
    }
  },

  addPedido: async (newOrder) => {
    try {
      const createdOrder = await createOrder(newOrder);
      set((state) => ({
        orders: [...state.orders, createdOrder],
      }));
    } catch (error) {
      console.error('Error adding order in store:', error);
    }
  },

  updatePedido: async (id, updatedOrder) => {
    try {
      const order = await updateOrder(id, updatedOrder);
      set((state) => ({
        orders: state.orders.map((o) => (o.id_pedido === id ? order : o)),
      }));
    } catch (error) {
      console.error(`Error updating order ${id} in store:`, error);
    }
  },

  deletePedido: async (id) => {
    try {
      await deleteOrder(id);
      set((state) => ({
        orders: state.orders.filter((o) => o.id_pedido !== id),
      }));
    } catch (error) {
      console.error(`Error deleting order ${id} in store:`, error);
    }
  },
}));
