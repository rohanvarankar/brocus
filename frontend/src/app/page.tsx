'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, Plus, RefreshCw, Layers, SlidersHorizontal, ArrowRight, DollarSign, Eye, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

import AuthModal from '../components/AuthModal';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import HeroSection from '../components/HeroSection';
import FilterPanel from '../components/FilterPanel';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';



export default function HomePage() {
  const { user } = useAuth();
  
  // Database store products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  
  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  




  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalUnfilteredProducts, setTotalUnfilteredProducts] = useState<number>(0);
  const [limit] = useState<number>(8);

  const [prevFilters, setPrevFilters] = useState({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false,
  });

  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(['All', ...data]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // Fetch products data with pagination and filters
  const fetchProductsData = async (activePage: number = currentPage) => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search: debouncedSearch,
        category: selectedCategory,
        page: activePage,
        limit,
        minPrice,
        maxPrice,
        inStockOnly,
      });

      const prods = data.products || [];
      setAllProducts(prods);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);

      const hasFilters =
        debouncedSearch ||
        (selectedCategory !== 'All' && selectedCategory !== '') ||
        minPrice ||
        maxPrice ||
        inStockOnly;

      if (!hasFilters) {
        setTotalUnfilteredProducts(data.totalProducts || 0);
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to load products list from server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = () => {
    fetchProductsData(currentPage);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    let activePage = currentPage;
    const filtersChanged =
      debouncedSearch !== prevFilters.search ||
      selectedCategory !== prevFilters.category ||
      minPrice !== prevFilters.minPrice ||
      maxPrice !== prevFilters.maxPrice ||
      inStockOnly !== prevFilters.inStockOnly;

    if (filtersChanged) {
      activePage = 1;
      setCurrentPage(1);
      setPrevFilters({
        search: debouncedSearch,
        category: selectedCategory,
        minPrice,
        maxPrice,
        inStockOnly,
      });
    }

    fetchProductsData(activePage);
  }, [debouncedSearch, selectedCategory, currentPage, limit, minPrice, maxPrice, inStockOnly]);

  const filteredProducts = allProducts;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setCurrentPage(1);
  };

  // Auth modal triggers
  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };




  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      {/* Sticky top navigation bar */}
      <Navbar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAuth={openAuthModal}
      />

      {/* Hero Banner Section */}
      <HeroSection />

      {/* Main Page Area */}
      <main id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full flex-1">
        
        {/* Layout: Desktop (Side-by-side or Top Toolbar), Mobile (Vertical block stacks) */}
        <div className="flex flex-col gap-8">
          


          {/* Search, Filters, and Options Panel */}
          <FilterPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
            onClear={handleClearFilters}
            categories={categories}
          />

          {/* Product Grid showcase */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod._id}
                      product={prod}
                      onOpenLogin={() => openAuthModal('login')}
                    />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 mt-8 gap-4">
                  <div className="text-xs text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * limit + 1}</span> to{' '}
                    <span className="font-semibold text-slate-900">
                      {Math.min(currentPage * limit, totalProducts)}
                    </span>{' '}
                    of <span className="font-semibold text-slate-900">{totalProducts}</span> entries
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            currentPage === pageNum
                                ? 'bg-blue-600 text-white shadow-sm'
                              : 'border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="No Products Found"
              description={
                searchQuery || selectedCategory !== 'All' || minPrice !== '' || maxPrice !== '' || inStockOnly
                  ? "We couldn't find any products matching your active filter criteria."
                  : 'There are currently no products available in the shop catalogue.'
              }
              actionText="Reset Filters"
              onAction={handleClearFilters}
              isSearch={true}
            />
          )}
        </div>
      </main>

      {/* Footer details */}
      <footer className="border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Brocus Solution. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2 font-medium">
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Terms of Service</Link>
            <Link href="/purchases" className="hover:underline">Order Tracking</Link>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </div>
  );
}
