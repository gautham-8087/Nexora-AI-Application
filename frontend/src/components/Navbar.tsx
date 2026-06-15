'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import ThemeToggle from './ThemeToggle';
import { Sparkles, LogIn, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { clearSearch, currentUser, setAuthModalOpen, logoutUser } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 right-0 w-full z-20 bg-white/70 dark:bg-[#151616]/75 backdrop-blur-md border-b border-slate-200/80 dark:border-[#2d3030]/80 px-6 py-4 flex items-center justify-between text-slate-700 dark:text-slate-200 transition-all duration-300 select-none">
      
      {/* Brand Logo & Clear Thread */}
      <div 
        onClick={clearSearch}
        className="flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-500/10 group-hover:scale-[1.04] transition-all duration-300">
          N
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
            Nexora <span className="text-emerald-600 dark:text-[#10b981]">AI</span>
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider font-semibold uppercase mt-0.5">
            Research Platform
          </span>
        </div>
      </div>

      {/* Navigation Options & Mode Toggle */}
      <div className="flex items-center gap-4">
        {/* Pro Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-[#10b981] border border-emerald-500/20">
          <Sparkles size={11} className="animate-pulse" />
          <span>SaaS Edition</span>
        </div>

        {/* Theme Switching Button */}
        <ThemeToggle />

        {/* Auth / Account Profile Button */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#202222]/80 border border-slate-200/60 dark:border-[#2d3030]/60 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all duration-150 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.name}</span>
              <ChevronDown size={12} className={`text-slate-450 dark:text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#181a1a] border border-slate-200 dark:border-[#2d3030] rounded-2xl shadow-xl py-2 z-35 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2d3030]/40 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-405 dark:text-slate-500 truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-colors cursor-pointer text-left"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs transition-all duration-200 shadow-sm cursor-pointer select-none"
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </button>
        )}
      </div>

    </header>
  );
};

export default Navbar;
