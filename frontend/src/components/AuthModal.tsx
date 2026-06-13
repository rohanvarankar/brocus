'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: saveAuth } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (tab === 'signup') {
        const res = await authService.signup({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        saveAuth({ user: res, token: res.token });
        toast.success(`Account created! Welcome, ${res.name}.`);
        onClose();
        reset();
      } else {
        const res = await authService.login({
          email: data.email,
          password: data.password,
        });
        saveAuth({ user: res, token: res.token });
        toast.success(`Logged in successfully! Welcome back, ${res.name}.`);
        onClose();
        reset();
      }
    } catch (error: any) {
      const errMsg = error.message || 'An error occurred';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab: 'login' | 'signup') => {
    setTab(newTab);
    setShowPassword(false);
    reset();
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
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Logo & Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-md text-[10px] font-bold mb-3 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Brocus Store</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {tab === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {tab === 'login'
                  ? 'Enter your credentials to access your store dashboard.'
                  : 'Get started and access premium shopping options.'}
              </p>
            </div>

            {/* Tabs selector */}
            <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => switchTab('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Rohan Dev"
                      {...register('name', {
                        required: tab === 'signup' ? 'Name is required' : false,
                      })}
                      className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-blue-500 ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full pl-9 pr-4 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-blue-500 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    className={`w-full pl-9 pr-10 py-2 bg-slate-50 border rounded-lg text-xs outline-none transition focus:bg-white focus:border-blue-500 ${
                      errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-[10px] mt-1 block font-semibold">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm active:scale-98 disabled:opacity-75 disabled:pointer-events-none mt-4 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
