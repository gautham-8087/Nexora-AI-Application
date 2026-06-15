'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Volume2, Share2, CornerDownLeft, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnswerCardProps {
  answer: string;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      // Clean citations before speaking
      const spokenText = answer.replace(/\[\d+\]/g, '');
      const utterance = new SpeechSynthesisUtterance(spokenText);
      window.speechSynthesis.cancel(); // cancel any active speech
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported on this browser.");
    }
  };

  // Convert custom markdown format to React elements
  const formatTextContent = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeSnippet: string[] = [];

    const reactElements = lines.map((line, idx) => {
      // Code Blocks parsing
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const block = codeSnippet.join('\n');
          codeSnippet = [];
          return (
            <pre key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono my-3 shadow-inner">
              <code>{block}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeSnippet.push(line);
        return null;
      }

      // Headers (### Header)
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-1.5 first:mt-0 font-sans">
            {line.substring(4)}
          </h3>
        );
      }

      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const lineContent = line.trim().substring(2);
        return (
          <li key={idx} className="list-disc ml-5 mb-1.5 text-slate-700 dark:text-slate-300 text-[14px] leading-relaxed">
            {parseCitationsAndBoldText(lineContent)}
          </li>
        );
      }

      const orderedListMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (orderedListMatch) {
        const lineContent = orderedListMatch[2];
        return (
          <li key={idx} className="list-decimal ml-5 mb-1.5 text-slate-700 dark:text-slate-300 text-[14px] leading-relaxed">
            {parseCitationsAndBoldText(lineContent)}
          </li>
        );
      }

      // Spacing lines
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      // General paragraphs
      return (
        <p key={idx} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed text-[14.5px]">
          {parseCitationsAndBoldText(line)}
        </p>
      );
    });

    return <div className="font-sans leading-normal">{reactElements}</div>;
  };

  // Parses bold (**text**), code (`text`), and citation index bubbles ([1])
  const parseCitationsAndBoldText = (text: string) => {
    const inlineTokens = /(\*\*.*?\*\*|`.*?`|\[\d+\])/g;
    const tokens = text.split(inlineTokens);

    return tokens.map((token, index) => {
      // Bold style
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-950 dark:text-white">{token.slice(2, -2)}</strong>;
      }
      
      // Inline Code blocks
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#252727] font-mono text-xs text-emerald-600 dark:text-[#10b981] font-semibold border border-slate-200/50 dark:border-slate-800">
            {token.slice(1, -1)}
          </code>
        );
      }

      // Citation index triggers
      const citationMatch = token.match(/^\[(\d+)\]$/);
      if (citationMatch) {
        const indexNumber = citationMatch[1];
        return (
          <button
            key={index}
            onClick={() => {
              const cardElement = document.getElementById(`source-card-${indexNumber}`);
              if (cardElement) {
                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                cardElement.classList.add('ring-3', 'ring-emerald-500/50', 'scale-[1.02]');
                setTimeout(() => {
                  cardElement.classList.remove('ring-3', 'ring-emerald-500/50', 'scale-[1.02]');
                }, 2000);
              }
            }}
            className="inline-flex items-center justify-center align-super bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#10b981] hover:bg-emerald-200 dark:hover:bg-emerald-500/20 font-bold rounded-full w-4.5 h-4.5 text-[9.5px] cursor-pointer transition-colors duration-150 select-none mx-0.5"
            aria-label={`Source citation ${indexNumber}`}
          >
            {indexNumber}
          </button>
        );
      }

      return token;
    });
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white dark:bg-[#1c1e1e] border border-slate-200/80 dark:border-[#2d3030]/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 transition-all duration-300"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-[#2d3030]/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center shrink-0">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-none">Response</h2>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Nexora Synthesis Model</span>
          </div>
        </div>

        {/* Floating actions */}
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <button
            onClick={handleCopy}
            title="Copy response text"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252727] hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer select-none"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>
          
          <button
            onClick={handleReadAloud}
            title="Read summary aloud"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#252727] hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer select-none"
          >
            <Volume2 size={15} />
          </button>
        </div>
      </div>

      {/* Render parsed text content block */}
      <div className="flex-1 text-slate-800 dark:text-slate-200">
        {formatTextContent(answer)}
      </div>

      {/* Action Footer info */}
      <div className="flex flex-wrap items-center justify-between mt-2 pt-3.5 border-t border-slate-100 dark:border-[#2d3030]/30 text-[11px] text-slate-400 dark:text-slate-500">
        <span>Information is backed by indexed references. Verify citations directly.</span>
        
        <div className="flex items-center gap-1 text-emerald-600 dark:text-[#10b981] font-semibold hover:underline cursor-pointer">
          <CornerDownLeft size={10} />
          <span>Submit follow-up questions below</span>
        </div>
      </div>
    </motion.article>
  );
};

export default AnswerCard;
