'use client';

import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { Mail, Lock, User, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
  const { isAuthModalOpen, setAuthModalOpen, loginUser, registerUser } = useSearch();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);

    try {
      if (mode === 'signin') {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      // Reset state
      setEmail('');
      setPassword('');
      setName('');
      setAuthError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setAuthError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'signin' ? 'signup' : 'signin');
    setAuthError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAuthModalOpen(false)}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
      />

      {/* Modal card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-md bg-white dark:bg-[#181a1a] border border-slate-200 dark:border-[#2d3030]/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 select-none overflow-hidden"
      >
        {/* Sleek top glowing border decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#202222] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 flex items-center justify-center text-white font-extrabold text-base shadow-md">
            N
          </div>
          <h2 className="text-xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Nexora AI Research Platform
          </p>
        </div>

        {/* Error notification banner */}
        {authError && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 rounded-xl text-red-650 dark:text-red-400 text-[11.5px] leading-relaxed">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Gautham Research"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#2d3030]/80 bg-slate-50 dark:bg-[#1c1e1e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-150"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-3 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                placeholder="your.email@nexora.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#2d3030]/80 bg-slate-50 dark:bg-[#1c1e1e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-150"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#2d3030]/80 bg-slate-50 dark:bg-[#1c1e1e] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-150"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 mt-2 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={13} />
                <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#2d3030]/40 text-center">
          <p className="text-[11.5px] text-slate-500 dark:text-slate-450">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-emerald-600 dark:text-[#10b981] font-bold hover:underline cursor-pointer bg-transparent border-0"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default AuthModal;
