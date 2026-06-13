'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, AlertTriangle, Loader2 } from 'lucide-react';
import { Product } from '../types';

interface PurchaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (quantity: number) => Promise<void>;
  loading: boolean;
}

export default function PurchaseConfirmModal({
  isOpen,
  onClose,
  product,
  onConfirm,
  loading,
}: PurchaseConfirmModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen]);

  if (!product) return null;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const totalPrice = product.price * quantity;

  const handleConfirm = async () => {
    await onConfirm(quantity);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span>Confirm Purchase</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Please review your order details before completing checkout.
              </p>
            </div>

            {/* Product Details Section */}
            <div className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-5">
              <div className="relative w-20 h-20 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 truncate text-sm">
                    {product.title}
                  </h4>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200/50 text-[10px] text-slate-600 font-bold tracking-wide uppercase mt-1">
                    {product.category}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Unit Price:</span>
                  <span className="text-sm font-bold text-slate-900 ml-1">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-3 border-y border-slate-100 mb-5">
              <div>
                <span className="block text-sm font-semibold text-slate-900">Quantity</span>
                <span className="text-xs text-slate-500 font-medium">
                  {product.stock} items available
                </span>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-slate-800 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Price breakdown */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-semibold text-slate-500">Order Total</span>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Warning if stock is low */}
            {product.stock <= 5 && (
              <div className="flex gap-2 items-start p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5 text-amber-800">
                <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">
                  Hurry up! Only {product.stock} items left in stock. Finish checkout now to guarantee your order.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 text-sm font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 active:scale-98 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/10 active:scale-98 transition disabled:opacity-75 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Place Order</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
