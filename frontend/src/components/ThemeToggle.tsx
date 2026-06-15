'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#202222]" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-[#202222] p-1 flex items-center cursor-pointer transition-colors duration-300 focus:outline-none select-none border border-slate-300/50 dark:border-[#2d3030]/80 shadow-inner"
      aria-label="Toggle Theme"
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white dark:bg-[#10b981] flex items-center justify-center shadow-md shadow-emerald-500/10"
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        animate={{ x: theme === 'dark' ? 22 : 0 }}
      >
        {theme === 'dark' ? (
          <Moon size={12} className="text-white shrink-0" />
        ) : (
          <Sun size={12} className="text-amber-500 shrink-0" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
