'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Calendar, Package } from 'lucide-react';
import { orderService } from '../../../services/orderService';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Status updated successfully');
      fetchOrders(); // Refresh order data without page reload
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20';
    if (s === 'processing') return 'bg-blue-50 text-blue-600 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20';
    if (s === 'shipped') return 'bg-purple-50 text-purple-600 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20';
    if (s === 'delivered' || s === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400/20';
    if (s === 'cancelled') return 'bg-red-50 text-red-600 border-red-200 focus:border-red-400 focus:ring-red-400/20';
    return 'bg-slate-50 text-slate-600 border-slate-200 focus:border-slate-400 focus:ring-slate-400/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Platform Orders
        </h2>
        <div className="text-sm text-slate-500 font-medium">
          Total: <span className="text-indigo-600 font-bold">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No orders found on the platform.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{order.userId?.name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500">{order.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0 overflow-hidden">
                        {order.items && order.items.length > 0 && order.items[0].productId?.imageUrl ? (
                          <img src={order.items[0].productId.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">
                        {order.items && order.items.length > 0 ? (
                           order.items.length === 1 ? order.items[0].productId?.title : `${order.items[0].productId?.title} + ${order.items.length - 1} more`
                        ) : 'No items'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">${order.totalPrice?.toFixed(2)}</span>
                        <span className="text-xs text-slate-500">
                          {order.items ? order.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0} items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status || 'Pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-3 py-1.5 border outline-none ring-offset-0 ring-offset-transparent transition cursor-pointer ${getStatusColor(order.status || 'Pending')}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
