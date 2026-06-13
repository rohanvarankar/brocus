'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function CartDrawer() {
  const { cartItems, cartCount, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth();
  const { isCartOpen, closeCart, openCheckout } = useUI();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

  const handleCheckoutClick = () => {
    closeCart();
    openCheckout();
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Your Cart
                {cartCount > 0 && (
                  <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-1">
                    {cartCount}
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Sign in to view your cart</h3>
                  <p className="text-sm text-slate-500">You need to be logged into your account to manage your shopping cart.</p>
                </div>
              ) : loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-slate-100 rounded-2xl w-full"></div>
                  <div className="h-24 bg-slate-100 rounded-2xl w-full"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-[0.98] transition"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-slate-50 rounded-xl relative overflow-hidden shrink-0 border border-slate-100 p-2 flex items-center justify-center">
                        <Image
                          src={item.productId.imageUrl}
                          alt={item.productId.title}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight">
                              {item.productId.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-slate-400 hover:text-red-500 transition p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-blue-600 font-extrabold text-sm mt-1">
                            ${item.productId.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1 w-max mt-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition active:scale-95 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition active:scale-95 disabled:opacity-50"
                            disabled={item.quantity >= item.productId.stock}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {user && cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="h-px bg-slate-200 w-full my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-xl font-extrabold text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl shadow-slate-900/20 transition active:scale-[0.98]"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
