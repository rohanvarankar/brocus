'use client';

import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Loader2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productService.getProducts({ limit: 1 }),
          orderService.getAllOrders()
        ]);

        const orders = Array.isArray(ordersRes) ? ordersRes : [];
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        setStats({
          totalProducts: productsRes.totalProducts || 0,
          totalOrders: orders.length,
          totalRevenue,
        });

        // Top 5 recent orders
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Active Users', value: '---', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' }, // Placeholder
  ];

  return (
    <div className="space-y-6 text-slate-900">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.userId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-700">{order.productId?.title || 'Deleted Product'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ${order.totalPrice?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold capitalize">
                        {order.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
