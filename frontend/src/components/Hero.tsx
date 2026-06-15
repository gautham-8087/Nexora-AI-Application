'use client';

import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative text-center flex flex-col items-center gap-5 pt-12 pb-6 max-w-4xl mx-auto px-4 select-none">
      
      {/* Brand Intro Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#10b981] border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm shadow-emerald-500/5"
      >
        <BrainCircuit size={13} className="animate-pulse" />
        <span>Enterprise Intelligence Platform</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-2xl leading-[1.1] text-slate-900 dark:text-white"
      >
        Search Smarter.<br />
        <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-[#10b981] dark:to-teal-400 bg-clip-text text-transparent">
          Understand Deeper.
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-lg leading-relaxed mt-2"
      >
        Unlock instant, synthesized research briefs backed by live, verifiable source citations. Designed for complex data analysis.
      </motion.p>

    </section>
  );
};

export default Hero;
