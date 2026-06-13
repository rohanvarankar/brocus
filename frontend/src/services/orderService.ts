import api from './api';
import { Product, Order, OrderItem } from '../types';

export const orderService = {
  async checkout(): Promise<Order> {
    const response = await api.post('/checkout');
    return response.data.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    return response.data.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data.data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },
};
