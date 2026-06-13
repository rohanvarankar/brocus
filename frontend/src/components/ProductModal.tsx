'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, Tag, Plus, Archive, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // If passed, we are in Edit Mode
  onSuccess: (updatedProduct: Product, isEdit: boolean) => void;
}

const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Books',
  'Fitness & Outdoors',
  'Beauty & Personal Care',
  'Other',
];

export default function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      category: 'Electronics',
      price: '',
      stock: '',
    },
  });

  // Populate form if in edit mode
  useEffect(() => {
    if (product) {
      setValue('title', product.title);
      setValue('description', product.description);
      setValue('imageUrl', product.imageUrl);
      setValue('category', product.category);
      setValue('price', String(product.price));
      setValue('stock', String(product.stock));
    } else {
      reset({
        title: '',
        description: '',
        imageUrl: '',
        category: 'Electronics',
        price: '',
        stock: '',
      });
    }
  }, [product, setValue, reset, isOpen]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        price: Number(data.price),
        stock: Number(data.stock),
      };

      let res: Product;
      if (isEdit && product) {
        res = await productService.updateProduct(product._id, payload);
        toast.success('Product details updated successfully!');
      } else {
        res = await productService.createProduct(payload);
        toast.success('Product listed successfully!');
      }
      
      onSuccess(res, isEdit);
      onClose();
      reset();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || 'Failed to save product details.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex flex-col mb-5">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md text-[10px] font-bold mb-3 uppercase tracking-wider self-start">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Inventory setup</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEdit ? 'Modify product' : 'Publish new product'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isEdit ? 'Update details of your existing store product.' : 'Fill in the information to publish a new product in the store.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Product Title
                </label>
                <div className="relative">
                  <Archive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Keyboard"
                    {...register('title', { required: 'Title is required' })}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 ${
                      errors.title ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.title && (
                  <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Specify product details, sizing, features, and specs..."
                  rows={3}
                  {...register('description', { required: 'Description is required' })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 ${
                    errors.description ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
                />
                {errors.description && (
                  <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Product Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    {...register('imageUrl', {
                      required: 'Image URL is required',
                      pattern: {
                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                        message: 'Please provide a valid image URL',
                      },
                    })}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 ${
                      errors.imageUrl ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.imageUrl && (
                  <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                    {errors.imageUrl.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="9.99"
                      {...register('price', {
                        required: 'Required',
                        min: { value: 0, message: 'Min 0' },
                      })}
                      className={`w-full px-2 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 ${
                        errors.price ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.price && (
                      <span className="text-red-500 text-[9px] mt-1 block font-semibold">
                        {errors.price.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Stock
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      {...register('stock', {
                        required: 'Required',
                        min: { value: 0, message: 'Min 0' },
                      })}
                      className={`w-full px-2 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-indigo-500 ${
                        errors.stock ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.stock && (
                      <span className="text-red-500 text-[9px] mt-1 block font-semibold">
                        {errors.stock.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm active:scale-98 disabled:opacity-75 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEdit ? 'Update Details' : 'Publish Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
