'use client';

import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  isSearch?: boolean;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  isSearch = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-6">
        {isSearch ? (
          <Search className="w-10 h-10" />
        ) : (
          <ShoppingBag className="w-10 h-10" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
