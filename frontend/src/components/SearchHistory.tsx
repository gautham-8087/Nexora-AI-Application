'use client';

import React from 'react';
import { useSearch } from '../context/SearchContext';
import { MessageSquare, Clock, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchHistory = ({ isOpen, onClose }: SearchHistoryProps) => {
  const { history, viewThreadDetails, activeThread } = useSearch();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-30"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 h-screen w-80 bg-white dark:bg-[#181a1a] border-r border-slate-200/80 dark:border-[#2d3030]/80 shadow-2xl z-40 flex flex-col transition-all duration-300"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-[#2d3030]/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Clock size={16} className="text-emerald-500" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Research Threads</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252727] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close Sidebar"
              >
                <X size={16} />
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
              {history && history.length > 0 ? (
                history.map((item) => {
                  const isActive = activeThread?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        viewThreadDetails(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                        isActive
                          ? 'bg-slate-100 dark:bg-[#252727] border-l-3 border-emerald-500 text-emerald-600 dark:text-[#10b981]'
                          : 'hover:bg-slate-50 dark:hover:bg-[#202222]/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <MessageSquare 
                        size={15} 
                        className={`mt-0.5 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'
                        }`} 
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <span className="text-sm font-semibold truncate group-hover:text-slate-900 dark:group-hover:text-white leading-snug">
                          {item.query}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono font-medium">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <MessageSquare size={32} className="text-slate-300 dark:text-slate-700 mb-2.5" />
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">No research history found</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[180px]">Your research queries will populate here.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer info */}
            <div className="p-4 border-t border-slate-100 dark:border-[#2d3030]/60 bg-slate-50/50 dark:bg-[#202222]/10 text-[10px] text-slate-400 dark:text-slate-500 select-none">
              <span>Nexora Local Thread Archives are cached for seamless retrieval.</span>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchHistory;
