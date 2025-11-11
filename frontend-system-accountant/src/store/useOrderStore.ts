import { create } from 'zustand';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import type { Order } from '../types/Order';
import type { Producto } from '../interface/interfaceProduct';
import type { User } from '../types/Users';

interface CartItem extends Producto {
  quantity: number;
}

interface OrderStore {
  orders: Order[];
  cart: CartItem[];
  cargarPedidos: () => Promise<void>;
  addPedido: (user: User, cart: CartItem[]) => Promise<void>;
  updatePedido: (id: number, updatedOrder: Partial<Order>) => Promise<void>;
  deletePedido: (id: number) => Promise<void>;
  addToCart: (product: Producto) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  cart: [],

  cargarPedidos: async () => {
    try {
      const orders = await getOrders();
      set({ orders });
    } catch (error) {
      console.error('Error loading orders in store:', error);
    }
  },

  addPedido: async (user, cart) => {
    try {
      const total = cart.reduce((acc, item) => acc + parseFloat(item.precio) * item.quantity, 0);
      const newOrder = {
        total: total.toFixed(2),
        id_usuario: user.id_usuario, // <--- Changed here
        productos: cart.map(item => ({
          id_producto: item.id_producto,
          nombre: item.nombre,
          cantidad: item.quantity,
          precio_unitario: Number(item.precio),
        })),
      };
      console.log('Enviando pedido:', newOrder);
      const createdOrder = await createOrder(newOrder);
      set((state) => ({
        orders: [...state.orders, createdOrder],
        cart: [],
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

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id_producto === product.id_producto);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id_producto === product.id_producto
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id_producto === productId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          cart: state.cart.map((item) =>
            item.id_producto === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
      return { cart: state.cart.filter((item) => item.id_producto !== productId) };
    });
  },

  clearCart: () => {
    set({ cart: [] });
  },
}));
