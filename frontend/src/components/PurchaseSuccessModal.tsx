'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ClipboardList, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  quantity: number;
  totalPrice: number;
}

export default function PurchaseSuccessModal({
  isOpen,
  onClose,
  product,
  quantity,
  totalPrice,
}: PurchaseSuccessModalProps) {
  const router = useRouter();

  if (!product) return null;

  const handleGoToOrders = () => {
    onClose();
    router.push('/purchases');
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 z-10 text-center"
          >
            {/* Success Icon Badge */}
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Purchase Successful!
            </h3>
            <p className="text-xs text-slate-500 mb-6 px-4">
              Thank you for your business. Your transaction has completed successfully and a receipt has been generated.
            </p>

            {/* Receipt Summary Block */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-left text-xs space-y-2.5 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Item Ordered</span>
                <span className="font-semibold text-slate-800 max-w-[200px] truncate">
                  {product.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Quantity</span>
                <span className="font-semibold text-slate-800">
                  {quantity} unit(s)
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2.5">
                <span className="text-slate-400 font-bold">Total Amount Paid</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleGoToOrders}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/10 active:scale-98 transition"
              >
                <ClipboardList className="w-4 h-4" />
                <span>View Order Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 text-sm font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 active:scale-98 transition"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
