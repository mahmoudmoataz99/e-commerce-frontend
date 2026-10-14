import { create } from 'zustand';
import { api, getErrorMessage } from '../api/client';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<CartItem[]>('/cart');
      set({ items: data, isLoading: false });
    } catch {
      set({ items: [], isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, size, color) => {
    try {
      await api.post('/cart', {
        product_id: productId,
        quantity,
        selected_size: size || null,
        selected_color: color || null,
      });
      await get().fetchCart();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      await get().fetchCart();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  removeItem: async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await get().fetchCart();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [] });
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),
}));
