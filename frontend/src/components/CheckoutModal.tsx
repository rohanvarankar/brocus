'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { CheckCircle, ShieldCheck, CreditCard, ArrowRight, Package, Check, ClipboardList, X } from 'lucide-react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutModal() {
  const { cartItems, cartCount, fetchCart } = useCart();
  const { user } = useAuth();
  const { isCheckoutOpen, closeCheckout, openOrders } = useUI();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      await orderService.checkout();
      await fetchCart();
      setIsProcessing(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || 'Failed to process order. Please try again.');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    closeCheckout();
    openOrders();
  };

  const handleCloseAll = () => {
    setShowSuccessModal(false);
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAll}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {!showSuccessModal ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-50 shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-white border-b border-slate-100 rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Secure Checkout</h2>
                <p className="text-sm text-slate-500">Review and complete your purchase</p>
              </div>
              <button
                onClick={closeCheckout}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Details Left Side */}
              <div className="lg:col-span-2 space-y-4">
                {/* Delivery Info */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Delivery Information
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
                    <p className="text-slate-500 text-sm mt-1">Digital Delivery / Pick-up</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Payment Method
                  </h3>
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white text-[8px] font-bold tracking-widest">
                        VISA
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">•••• •••• •••• 4242</p>
                        <p className="text-slate-500 text-xs mt-0.5">Expires 12/28</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm max-h-[300px] overflow-y-auto">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Order Items
                  </h3>
                  <ul className="divide-y divide-slate-100">
                    {cartItems.map(item => (
                      <li key={item._id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                            <img src={item.productId.imageUrl} alt={item.productId.title} className="w-6 h-6 object-contain" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm line-clamp-1">{item.productId.title}</p>
                            <p className="text-slate-500 text-xs mt-0.5">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">${(item.productId.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checkout Action Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
                  <h3 className="text-base font-bold text-slate-900 mb-5">Payment Summary</h3>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Items ({cartCount})</span>
                      <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Tax (0%)</span>
                      <span className="font-semibold text-slate-800">$0.00</span>
                    </div>
                  </div>

                  <hr className="border-slate-100 mb-5" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || cartCount === 0}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-900/20 disabled:opacity-70 disabled:pointer-events-none transition active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <span>Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-8 z-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
            <p className="text-sm text-slate-500 mb-8 px-2">
              Thank you for your business. Your multi-item order has been placed successfully and is being processed.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCloseSuccess}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/10 active:scale-[0.98] transition cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                <span>View Order Log</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-3.5 text-sm font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
