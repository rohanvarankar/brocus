export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: Product;
  title: string;
  imageUrl: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: any;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}
