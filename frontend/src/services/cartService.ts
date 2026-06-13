import { Product } from '../types';
import api from './api';

export interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
}

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    const res = await api.get('/cart');
    return res.data.items || res.data.data?.items || [];
  },

  async addToCart(productId: string, quantity: number = 1): Promise<CartItem[]> {
    const res = await api.post('/cart', { productId, quantity });
    return res.data.items || res.data.data?.items || [];
  },

  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem[]> {
    const res = await api.put(`/cart/${cartItemId}`, { quantity });
    return res.data.items || res.data.data?.items || [];
  },

  async removeCartItem(cartItemId: string): Promise<void> {
    await api.delete(`/cart/${cartItemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart/clear');
  },
};
