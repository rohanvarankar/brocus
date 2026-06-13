'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, X, Loader2, Package, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { orderService } from '../services/orderService';
import { Order } from '../types';
import toast from 'react-hot-toast';

export default function OrdersDrawer() {
  const { user, token } = useAuth();
  const { isOrdersOpen, closeOrders } = useUI();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOrdersOpen && token) {
      fetchOrders();
    }
  }, [isOrdersOpen, token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error: any) {
      toast.error('Failed to load your purchase history.');
    } finally {
      setLoading(false);
    }
  };

  const totalSpend = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending': return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-600">Pending</span>;
      case 'processing': return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-600">Processing</span>;
      case 'shipped': return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-50 text-purple-600">Shipped</span>;
      case 'delivered': 
      case 'completed': return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-600">Delivered</span>;
      case 'cancelled': return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-50 text-red-600">Cancelled</span>;
      default: return <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-50 text-slate-600">{status}</span>;
    }
  };

  return (
    <AnimatePresence>
      {isOrdersOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrders}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                Your Orders
              </h2>
              <button
                onClick={closeOrders}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Sign in to view orders</h3>
                  <p className="text-sm text-slate-500 mb-6">Please log in to access your purchase history.</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
                  <p className="text-sm text-slate-500">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No orders found</h3>
                  <p className="text-sm text-slate-500 mb-6">You haven't made any purchases yet.</p>
                  <button
                    onClick={closeOrders}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md active:scale-[0.98] transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Total Orders</p>
                      <p className="text-lg font-bold text-slate-900">{orders.length}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">Total Spend</p>
                      <p className="text-lg font-bold text-indigo-600">${totalSpend.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order List */}
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Order ID</p>
                          <p className="text-xs font-mono text-slate-700">{order._id.substring(0, 8)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                          <p className="text-xs font-medium text-slate-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-50 p-4">
                        {order.items.map((item, idx) => {
                          return (
                            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 p-1">
                                {(item.imageUrl || item.productId?.imageUrl) ? (
                                  <Image src={item.imageUrl || item.productId?.imageUrl || ''} alt={item.title || item.productId?.title || 'Product'} width={40} height={40} className="object-contain" unoptimized />
                                ) : (
                                  <Package className="w-5 h-5 text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{item.title || item.productId?.title || 'Unknown Product'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-semibold text-slate-600">{item.quantity} × ${item.price.toFixed(2)}</span>
                                  {getStatusBadge(order.status)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-600">Order Total</span>
                        <span className="text-sm font-extrabold text-slate-900">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
