'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Search, Plus, Menu, X, LogIn, LogOut, ClipboardList, ChevronDown, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';

interface NavbarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
}

export default function Navbar({
  search = '',
  onSearchChange,
  onOpenAuth,
}: NavbarProps) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { openCart, openOrders } = useUI();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isHome = pathname === '/';

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav shadow-sm bg-white/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-base shadow-sm group-hover:bg-slate-800 transition">
                B
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900">
                Brocus<span className="text-slate-600 font-semibold">Store</span>
              </span>
            </Link>
          </div>

          {/* Search Input (Desktop - Vercel style) */}
          {isHome && onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-xs text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* Desktop Right navigation */}
          <div className="hidden md:flex items-center gap-3">
            {user?.role !== 'admin' && (
              <button
                onClick={openCart}
                className="relative flex items-center justify-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-600 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <>
                {/* Admin button removed, moved to profile dropdown */}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition outline-none cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.96, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-20"
                        >
                          <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <span className="block text-xs font-bold text-slate-800 truncate">{user.name}</span>
                            <span className="block text-[10px] text-slate-400 truncate">{user.email}</span>
                          </div>
                          
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                openOrders();
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                            >
                              <ClipboardList className="w-4 h-4 text-slate-400" />
                              <span>My Orders</span>
                            </button>
                          )}

                          {user.role === 'admin' && (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-400" />
                              <span>Admin Panel</span>
                            </Link>
                          )}

                          <hr className="border-slate-100 my-1" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Hamburger Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            {user?.role !== 'admin' && (
              <button
                onClick={openCart}
                className="relative flex items-center justify-center p-1.5 rounded-lg text-slate-600 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs md:hidden"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-white border-l border-slate-200 shadow-2xl p-5 flex flex-col justify-between md:hidden"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Navigation
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Search input */}
                {isHome && onSearchChange && (
                  <div className="relative w-full mb-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search catalogue..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                    />
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2.5">
                  {user && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg mb-4">
                      <span className="block text-xs font-bold text-slate-800 truncate">{user.name}</span>
                      <span className="block text-[9px] text-slate-400 truncate">{user.email}</span>
                    </div>
                  )}

                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition ${
                      pathname === '/'
                        ? 'bg-slate-100 text-slate-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span>Home Shop</span>
                  </Link>

                  {user?.role !== 'admin' && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openCart();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition text-slate-600 hover:bg-slate-50 cursor-pointer`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                        <span>Shopping Cart</span>
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  )}

                  {user && (
                    <>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            openOrders();
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition text-slate-600 hover:bg-slate-50 cursor-pointer`}
                        >
                          <ClipboardList className="w-4 h-4 text-slate-400" />
                          <span>My Orders</span>
                        </button>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-50 transition text-left cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-500" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Bottom */}
              <div>
                <hr className="border-slate-100 mb-4" />
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 font-semibold text-xs transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth?.('login');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
