'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/60 dark:border-[#2d3030]/60 bg-white/40 dark:bg-[#151616]/40 py-6 px-8 mt-auto text-slate-500 dark:text-slate-400 text-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        
        {/* Brand details */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-tr from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 flex items-center justify-center text-white text-[9.5px] font-black">
            N
          </div>
          <span>&copy; {new Date().getFullYear()} Nexora AI. Search Smarter. Understand Deeper.</span>
        </div>

        {/* Corporate mock pages */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
          <a href="#" className="hover:text-emerald-600 dark:hover:text-[#10b981] transition-colors">Platform</a>
          <a href="#" className="hover:text-emerald-600 dark:hover:text-[#10b981] transition-colors">API Details</a>
          <a href="#" className="hover:text-emerald-600 dark:hover:text-[#10b981] transition-colors">Research Index</a>
          <a href="#" className="hover:text-emerald-600 dark:hover:text-[#10b981] transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-emerald-600 dark:hover:text-[#10b981] transition-colors">Privacy</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
