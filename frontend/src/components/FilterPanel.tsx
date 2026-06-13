'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  minPrice: string;
  onMinPriceChange: (price: string) => void;
  maxPrice: string;
  onMaxPriceChange: (price: string) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (inStock: boolean) => void;
  onClear: () => void;
  categories: string[];
}

export default function FilterPanel({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  inStockOnly,
  onInStockOnlyChange,
  onClear,
  categories,
}: FilterPanelProps) {
  return (
    <div className="bg-white py-4 mb-8 flex flex-col md:flex-row md:items-center gap-4 relative z-10">
      
      {/* Mobile Search - Visible only on small screens */}
      <div className="relative w-full md:hidden">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 transition text-slate-800 placeholder-slate-400"
        />
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full">
        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border-none rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 cursor-pointer text-slate-700 min-w-[140px] flex-1 md:flex-none font-medium appearance-none transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Price Min */}
        <div className="relative w-full md:w-28 flex-1 md:flex-none">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border-none rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 text-slate-800 font-medium transition-colors"
          />
        </div>
        <span className="hidden md:block text-slate-300">-</span>
        {/* Price Max */}
        <div className="relative w-full md:w-28 flex-1 md:flex-none">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border-none rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 text-slate-800 font-medium transition-colors"
          />
        </div>

        {/* In Stock */}
        <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 rounded-full cursor-pointer hover:bg-slate-100 transition flex-1 md:flex-none">
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => onInStockOnlyChange(e.target.checked)} 
            className="rounded-full border-none bg-slate-200 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer" 
          />
          <span className="text-sm text-slate-700 font-medium whitespace-nowrap">In Stock</span>
        </label>

        {/* Clear Filters */}
        <button
          onClick={onClear}
          className="md:ml-auto flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98] transition cursor-pointer w-full md:w-auto"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
