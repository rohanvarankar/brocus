import api from './api';

export const productService = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    minPrice?: string;
    maxPrice?: string;
    inStockOnly?: boolean;
  }) {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get('/products/categories');
    return response.data.data;
  },

  async getProduct(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/products', data);
    return response.data.data;
  },

  async updateProduct(id: string, data: any) {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  },
};
