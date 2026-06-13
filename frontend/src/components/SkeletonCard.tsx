'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex flex-col h-[420px] pulse-subtle">
      {/* Image skeleton */}
      <div className="relative w-full h-48 bg-slate-200 dark:bg-slate-800" />
      
      {/* Body skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
          
          {/* Title */}
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
          
          {/* Description */}
          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Footer Row */}
        <div>
          <hr className="border-slate-100 dark:border-slate-800/80 mb-4" />
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="h-7 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            
            {/* Button */}
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
