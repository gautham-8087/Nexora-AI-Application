'use client';

import React from 'react';
import { SourceReference } from '../types/index';
import { Globe, ArrowUpRight } from 'lucide-react';

interface SourceCardProps {
  source: SourceReference;
  index: number;
}

const SourceCard = ({ source, index }: SourceCardProps) => {
  const { title, url, snippet } = source;

  // Extract base hostname
  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = url;
  }

  // Favicon API helper
  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

  return (
    <a
      id={`source-card-${index}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white hover:bg-slate-50 dark:bg-[#1c1e1e] dark:hover:bg-[#202222] border border-slate-200/80 dark:border-[#2d3030]/80 rounded-xl p-4 transition-all duration-300 relative group cursor-pointer text-slate-800 dark:text-slate-200"
    >
      {/* Upper index badge */}
      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-100 dark:bg-[#252727] text-slate-500 dark:text-slate-400 font-extrabold text-[10px] flex items-center justify-center border border-slate-200/60 dark:border-slate-800/80 shadow-sm transition-colors group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 select-none">
        {index}
      </span>

      <div className="flex flex-col gap-2">
        {/* Favicon & Host Header */}
        <div className="flex items-center gap-2 pr-6 select-none">
          <img 
            src={faviconUrl} 
            alt={hostname} 
            onError={(e) => {
              // hide broken favicon, show fallback globe
              (e.target as HTMLElement).style.display = 'none';
              const fallback = (e.target as HTMLElement).nextSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
            className="w-4 h-4 rounded-sm object-contain shrink-0"
          />
          <div className="hidden w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Globe size={9} className="text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide truncate max-w-[130px]">
            {hostname}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-snug line-clamp-2 pr-4 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-sans">
          {title}
        </h4>

        {/* Snippet summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {snippet}
        </p>

        {/* Floating action indicator */}
        <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          <span>Read Research Brief</span>
          <ArrowUpRight size={10} />
        </div>
      </div>
    </a>
  );
};

export default SourceCard;
