'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Zap, Star, Laptop, Smartphone, Headphones, Watch, ShoppingBag } from 'lucide-react';

export default function HeroSection() {
  const handleBrowseClick = () => {
    const section = document.getElementById('collections');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-6"
            >
              <Star className="w-3 h-3 fill-blue-600" />
              <span>Premium Quality</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
            >
              Discover Premium Tech Products
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed"
            >
              Explore smartphones, laptops, accessories, gaming devices and more with a seamless shopping experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={handleBrowseClick}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Products</span>
              </button>
              <button
                onClick={handleBrowseClick}
                className="px-8 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-sm font-bold text-sm active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Learn More
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Secure Purchases</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Fast Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Quality Products</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Minimal Premium Showcase */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative h-[400px] lg:h-[500px]">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-[500px] h-full"
            >
              {/* Soft Abstract Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-blue-50 to-indigo-50/50 rounded-full blur-3xl opacity-80 z-0" />

              {/* Primary Focal Point: Premium Laptop (60% visual weight) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[190px] sm:h-[260px] rounded-2xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 z-20 bg-white group transition-transform duration-700 hover:scale-[1.02]">
                <Image src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop" alt="Premium Laptop" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">MacBook Pro</span>
                </div>
              </div>

              {/* Secondary Element: Headphones (Top Left) */}
              <div className="absolute top-[8%] sm:top-[10%] left-2 sm:left-[5%] w-[100px] sm:w-[130px] h-[100px] sm:h-[130px] rounded-2xl overflow-hidden shadow-xl border border-white z-10 bg-slate-50 transition-transform duration-700 hover:scale-105 hover:z-30">
                <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" alt="Premium Audio" fill className="object-cover" />
              </div>

              {/* Secondary Element: Smartwatch (Bottom Right) */}
              <div className="absolute bottom-[10%] sm:bottom-[12%] right-2 sm:right-[5%] w-[110px] sm:w-[140px] h-[110px] sm:h-[140px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white z-30 transition-transform duration-700 hover:scale-105">
                <Image src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop" alt="Smartwatch" fill className="object-cover" />
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
