'use client';

import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

const LoadingSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl mx-auto px-1 animate-pulse select-none">
      
      {/* Sources Skeleton Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Globe size={16} className="animate-spin text-emerald-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider">Locating references...</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1c1e1e] border border-slate-200/85 dark:border-[#2d3030]/80 rounded-xl p-4 flex flex-col gap-2.5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-300 dark:bg-slate-700/80 rounded" />
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-850 rounded" />
                <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-850 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Skeleton Block */}
      <div className="bg-white dark:bg-[#1c1e1e] border border-slate-200/85 dark:border-[#2d3030]/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100 dark:border-[#2d3030]/40">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div className="h-4.5 w-24 bg-slate-300 dark:bg-slate-755/90 rounded" />
        </div>

        {/* Text lines */}
        <div className="flex flex-col gap-3 py-1">
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3.5 w-[96%] bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3.5 w-[93%] bg-slate-200 dark:bg-slate-800 rounded" />
          
          <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
          <div className="h-3.5 w-[95%] bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3.5 w-[90%] bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>

    </div>
  );
};

export default LoadingSkeleton;
