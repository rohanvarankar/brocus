'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Tag, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function QuickViewModal() {
  const { isQuickViewOpen, closeQuickView, quickViewProduct } = useUI();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!quickViewProduct) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add to cart');
      return;
    }
    if (quickViewProduct.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    await addToCart(quickViewProduct._id, 1);
    toast.success('Added to cart!');
    closeQuickView();
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row"
          >
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <span className="absolute top-6 left-6 z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-md">
                <Tag className="w-3.5 h-3.5" />
                {quickViewProduct.category}
              </span>
              <div className="relative w-full h-full max-h-[400px]">
                <Image
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
              <div className="flex-1">
                <div className="mb-4">
                  {quickViewProduct.stock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle className="w-3.5 h-3.5" />
                      In Stock
                    </span>
                  ) : quickViewProduct.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Only {quickViewProduct.stock} left
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Out of Stock
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                  {quickViewProduct.title}
                </h2>
                
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                  {quickViewProduct.description}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</span>
                    <span className="text-3xl font-extrabold text-slate-900">
                      ${quickViewProduct.price.toFixed(2)}
                    </span>
                  </div>

                  {user?.role !== 'admin' && (
                    <button
                      onClick={handleAddToCart}
                      disabled={quickViewProduct.stock <= 0}
                      className="w-full flex items-center justify-center gap-2 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add To Cart</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
