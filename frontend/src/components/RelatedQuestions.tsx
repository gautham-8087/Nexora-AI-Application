'use client';

import React from 'react';
import { useSearch } from '../context/SearchContext';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RelatedQuestionsProps {
  questions: string[];
}

const RelatedQuestions = ({ questions }: RelatedQuestionsProps) => {
  const { triggerSearch } = useSearch();

  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full bg-white dark:bg-[#1c1e1e] border border-slate-200/80 dark:border-[#2d3030]/80 rounded-2xl p-5 shadow-sm transition-all duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#2d3030]/30 select-none">
        <HelpCircle size={15} className="text-emerald-500 shrink-0" />
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Suggested Follow-up
        </h3>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-2">
        {questions.map((question, idx) => (
          <motion.button
            key={idx}
            whileHover={{ x: 3 }}
            onClick={() => triggerSearch(question)}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#252727] text-left text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-350 hover:text-emerald-600 dark:hover:text-[#10b981] transition-all duration-200 group border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer"
          >
            <span className="truncate flex-1 pr-4 leading-normal">{question}</span>
            <ChevronRight 
              size={14} 
              className="text-slate-400 dark:text-slate-600 shrink-0 group-hover:text-emerald-500 transition-colors" 
            />
          </motion.button>
        ))}
      </div>

    </div>
  );
};

export default RelatedQuestions;
