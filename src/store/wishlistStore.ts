import { create } from 'zustand';
import { api, getErrorMessage } from '../api/client';
import type { WishlistItem } from '../types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggle: (productId: number) => Promise<boolean>; // returns true if now in wishlist
  remove: (id: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<WishlistItem[]>('/wishlist');
      set({ items: data, isLoading: false });
    } catch {
      set({ items: [], isLoading: false });
    }
  },

  toggle: async (productId) => {
    try {
      const { data } = await api.post<{ in_wishlist: boolean; message: string }>('/wishlist', {
        product_id: productId,
      });
      await get().fetchWishlist();
      return data.in_wishlist;
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  remove: async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      await get().fetchWishlist();
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  },

  isInWishlist: (productId) => get().items.some((i) => i.product_id === productId),
}));
