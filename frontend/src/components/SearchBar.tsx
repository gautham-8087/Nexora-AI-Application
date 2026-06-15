'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { 
  ArrowRight, 
  Globe, 
  Paperclip, 
  Sparkles, 
  BookOpen, 
  Pencil, 
  Code, 
  Video, 
  MessageSquare, 
  X, 
  FileText,
  ChevronDown
} from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
}

type FocusMode = 'all' | 'academic' | 'writing' | 'code' | 'youtube' | 'reddit';

const SearchBar = ({ placeholder = "Ask Nexora anything...", autoFocus = false }: SearchBarProps) => {
  const { triggerSearch, isLoading } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCopilot, setIsCopilot] = useState(true);
  
  // Working attachments state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  
  // Working Focus mode state
  const [focusMode, setFocusMode] = useState<FocusMode>('all');
  const [focusMenuOpen, setFocusMenuOpen] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const focusDropdownRef = useRef<HTMLDivElement>(null);

  // Resize text-area according to typing content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputValue]);

  // Handle focus triggers
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (focusDropdownRef.current && !focusDropdownRef.current.contains(e.target as Node)) {
        setFocusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((inputValue.trim() === '' && !attachedFile) || isLoading) return;
    
    // Pass query along with focus mode and attachments details
    let submissionQuery = inputValue;
    if (attachedFile) {
      submissionQuery += ` [Reading file: ${attachedFile.name}]`;
    }
    
    // Add focus metadata tag internally to let backend format the response accordingly
    if (focusMode !== 'all') {
      submissionQuery += ` (Focus: ${focusMode})`;
    }

    triggerSearch(submissionQuery);
    setInputValue('');
    setAttachedFile(null); // Reset attachment after search
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Attach button triggers hidden input click
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Focus configuration helpers
  const focusOptions = [
    { key: 'all', label: 'All', description: 'Search the entire web', icon: Globe },
    { key: 'academic', label: 'Academic', description: 'Search peer-reviewed papers', icon: BookOpen },
    { key: 'writing', label: 'Writing', description: 'Write content without searching', icon: Pencil },
    { key: 'code', label: 'Code', description: 'Write or debug scripts', icon: Code },
    { key: 'youtube', label: 'YouTube', description: 'Search and watch videos', icon: Video },
    { key: 'reddit', label: 'Reddit', description: 'Search forum discussions', icon: MessageSquare },
  ];

  const getFocusDetails = (mode: FocusMode) => {
    const option = focusOptions.find(o => o.key === mode);
    return option || focusOptions[0];
  };

  const ActiveFocusIcon = getFocusDetails(focusMode).icon;

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.txt,.doc,.docx,.js,.ts,.py,.csv,.json"
      />

      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white dark:bg-[#1c1e1e] border rounded-2xl p-3 flex flex-col transition-all duration-300 shadow-sm ${
          isFocused
            ? 'border-emerald-500/50 dark:border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)] ring-4 ring-emerald-500/5 dark:ring-emerald-500/5'
            : 'border-slate-200/80 dark:border-[#2d3030]/80'
        }`}
      >
        {/* Input container */}
        <div className="flex flex-col gap-2 w-full">
          
          {/* File attachment preview capsule */}
          {attachedFile && (
            <div className="flex items-center gap-1.5 self-start bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-[#10b981] px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 select-none">
              <FileText size={12} className="shrink-0" />
              <span className="truncate max-w-[180px]">{attachedFile.name}</span>
              <button 
                type="button" 
                onClick={removeAttachment}
                className="hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25 p-0.5 rounded-full cursor-pointer ml-0.5"
              >
                <X size={10} />
              </button>
            </div>
          )}

          <div className="flex items-start gap-3 w-full">
            <div className="text-slate-400 dark:text-slate-500 pt-2 shrink-0 select-none">
              <ActiveFocusIcon size={18} className="text-emerald-500/80 dark:text-[#10b981]/80" />
            </div>
            
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={attachedFile ? "Ask questions about this file..." : placeholder}
              className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[15px] resize-none py-1.5 leading-normal max-h-[180px] focus:ring-0"
            />
          </div>
        </div>

        {/* Action panel row */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-[#2d3030]/40">
          
          {/* Speed Dials */}
          <div className="flex items-center gap-2 select-none relative">
            
            {/* Working File Attach */}
            <button
              type="button"
              onClick={handleAttachClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#252727] text-slate-500 dark:text-slate-400 text-xs font-bold transition-all duration-150 cursor-pointer ${
                attachedFile ? 'text-emerald-600 dark:text-[#10b981]' : ''
              }`}
            >
              <Paperclip size={13} />
              <span>Attach</span>
            </button>

            {/* Working Focus mode picker trigger */}
            <div ref={focusDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setFocusMenuOpen(!focusMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#252727] text-slate-500 dark:text-slate-400 text-xs font-bold transition-all duration-150 cursor-pointer"
              >
                <ActiveFocusIcon size={13} className="text-emerald-500 mr-0.5" />
                <span className="capitalize">{getFocusDetails(focusMode).label}</span>
                <ChevronDown size={11} className="text-slate-400 dark:text-slate-500 ml-0.5" />
              </button>

              {/* Focus Selection Popover dropdown */}
              {focusMenuOpen && (
                <div className="absolute left-0 bottom-10 z-30 w-72 bg-white dark:bg-[#1c1e1e] border border-slate-200/80 dark:border-[#2d3030] rounded-xl shadow-xl p-2 flex flex-col gap-1 transition-all duration-200">
                  <h4 className="px-2.5 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    Select Search Focus
                  </h4>
                  {focusOptions.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = focusMode === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setFocusMode(opt.key as FocusMode);
                          setFocusMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#10b981]'
                            : 'hover:bg-slate-50 dark:hover:bg-[#252727] text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <OptIcon size={14} className="mt-0.5 shrink-0 text-emerald-500" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold">{opt.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">{opt.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Action panel items */}
          <div className="flex items-center gap-3">
            
            {/* Copilot Toggle */}
            <button
              type="button"
              onClick={() => setIsCopilot(!isCopilot)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none border ${
                isCopilot
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#10b981] border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                  : 'bg-transparent text-slate-400 border-slate-200 dark:border-[#2d3030]'
              }`}
            >
              <Sparkles size={11} className={isCopilot ? "animate-pulse" : ""} />
              <span>Copilot</span>
            </button>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={(inputValue.trim() === '' && !attachedFile) || isLoading}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
                (inputValue.trim() === '' && !attachedFile) || isLoading
                  ? 'bg-slate-100 dark:bg-[#252727] text-slate-300 dark:text-slate-600'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600'
              }`}
              aria-label="Submit Search"
            >
              <ArrowRight size={16} />
            </button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
