'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

interface ProductCardProps {
  product: Product;
  onOpenLogin: () => void;
}

export default function ProductCard({
  product,
  onOpenLogin,
}: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { openQuickView } = useUI();

  const handlePurchaseClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('You must be logged in to add to cart.');
      onOpenLogin();
      return;
    }

    if (product.stock <= 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    // Add to cart instead of direct purchase
    await addToCart(product._id, 1);
  };

  const getStockBadge = () => {
    if (product.stock <= 0) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-red-600 border border-red-100">
          <AlertTriangle className="w-3 h-3" />
          Out of Stock
        </span>
      );
    }
    if (product.stock <= 5) {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <AlertTriangle className="w-3 h-3" />
          Low Stock ({product.stock})
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
        <CheckCircle className="w-3 h-3" />
        {product.stock} in stock
      </span>
    );
  };

  return (
    <motion.div
      onClick={() => openQuickView(product)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.15, ease: 'easeOut' } }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-[460px] relative group cursor-pointer"
    >

      {/* Image container */}
      <div className="relative w-full h-56 bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-5">
        {/* Category badge */}
        <span className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
          <Tag className="w-2.5 h-2.5" />
          {product.category}
        </span>

        <div className="relative w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-[1.05]"
            unoptimized
          />
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            {getStockBadge()}
          </div>

          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-base leading-snug" title={product.title}>
            {product.title}
          </h3>

          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer */}
        <div>
          <hr className="border-slate-100 mb-3" />
          
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</span>
              <span className="text-xl font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {user?.role !== 'admin' && (
              <button
                onClick={handlePurchaseClick}
                disabled={product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 h-10 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white font-bold text-sm shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span className="truncate">Add To Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
