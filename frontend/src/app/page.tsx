'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import SearchHistory from '../components/SearchHistory';
import AnswerCard from '../components/AnswerCard';
import SourceCard from '../components/SourceCard';
import RelatedQuestions from '../components/RelatedQuestions';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { 
  History, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BarChart3, 
  Clock, 
  Check, 
  Share2, 
  CornerDownLeft, 
  AlertCircle,
  MessageSquare,
  Plus,
  User,
  Menu,
  BookOpen,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { 
    query, 
    activeThread, 
    history, 
    isLoading, 
    error, 
    activeView, 
    triggerSearch, 
    clearSearch, 
    viewThreadDetails,
    currentUser,
    setAuthModalOpen,
    switchThreadPath
  } = useSearch();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [threadCopied, setThreadCopied] = useState(false);
  
  // Prompt edit states
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added or loading states trigger
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages?.length, isLoading]);

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (followUp.trim() === '' || isLoading) return;
    triggerSearch(followUp);
    setFollowUp('');
  };

  const handleShareThread = () => {
    const threadLink = `${window.location.origin}/search?q=${encodeURIComponent(query)}`;
    navigator.clipboard.writeText(threadLink);
    setThreadCopied(true);
    setTimeout(() => setThreadCopied(false), 2000);
  };

  // Helper to compile version history details at a given message index in the thread
  const getVersionsAtMessageIndex = (msgIndex: number) => {
    if (!activeThread?.paths || !activeThread.messages) {
      return { currentVersion: 0, totalVersions: 0, matchingPaths: [] };
    }
    
    const activePath = activeThread.messages;
    const matchingPaths: { pathIndex: number; queryText: string }[] = [];

    activeThread.paths.forEach((path, pathIdx) => {
      // A path is a match/sibling if it matches the active path up to msgIndex - 1
      let matchesPrefix = true;
      for (let j = 0; j < msgIndex; j++) {
        if (!path[j] || !activePath[j] || path[j].id !== activePath[j].id) {
          matchesPrefix = false;
          break;
        }
      }

      if (matchesPrefix && path[msgIndex]) {
        matchingPaths.push({
          pathIndex: pathIdx,
          queryText: path[msgIndex].text
        });
      }
    });

    const activePathIdx = activeThread.activePathIndex || 0;
    const currentVersionIndex = matchingPaths.findIndex(item => item.pathIndex === activePathIdx);

    return {
      currentVersion: currentVersionIndex !== -1 ? currentVersionIndex + 1 : 1,
      totalVersions: matchingPaths.length,
      matchingPaths
    };
  };

  // Trending prompts
  const trendingSearches = [
    "Latest AI agent developments",
    "Quantum error correction milestones",
    "Multi-agent coordination architectures"
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#151616] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. PERMANENT LEFT SIDEBAR (Desktop: ChatGPT/Claude/Gemini style) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-50 dark:bg-[#181a1a] border-r border-slate-250 dark:border-[#2d3030]/80 h-screen fixed left-0 top-0 z-10 select-none">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-[#2d3030]/40 flex flex-col gap-4">
          <div 
            onClick={clearSearch}
            className="flex items-center gap-2 px-1 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 dark:from-[#10b981] dark:to-teal-400 flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Nexora <span className="text-emerald-600 dark:text-[#10b981]">AI</span>
            </span>
          </div>

          {/* Start New Thread button */}
          <button
            onClick={clearSearch}
            className="w-full flex items-center justify-between px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15 text-white dark:text-[#10b981] rounded-full border border-emerald-500/20 font-bold text-xs transition-all duration-200 shadow-sm shadow-emerald-500/5 cursor-pointer"
          >
            <span>New Research Chat</span>
            <Plus size={13} />
          </button>
        </div>

        {/* Recent Threads History list */}
        <div className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-1">
          <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 mb-2.5">
            Recent Threads
          </h4>
          {history && history.length > 0 ? (
            history.map((item) => {
              const isActive = activeThread?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => viewThreadDetails(item.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left transition-colors truncate group cursor-pointer ${
                    isActive
                      ? 'bg-slate-200/60 dark:bg-[#252727] text-emerald-600 dark:text-[#10b981] font-semibold border-l-2 border-emerald-500'
                      : 'hover:bg-slate-200/30 dark:hover:bg-[#202222]/30 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MessageSquare size={13} className={`mt-0.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                  <span className="text-xs truncate flex-1 group-hover:text-slate-900 dark:group-hover:text-white">
                    {item.query}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-[11px] italic text-slate-400 dark:text-slate-500">
              No chat records.
            </div>
          )}
        </div>

        {/* Sidebar Footer User detail */}
        <div className="p-3 border-t border-slate-200/50 dark:border-[#2d3030]/40 flex flex-col gap-2">
          {currentUser ? (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-200/30 dark:hover:bg-[#202222]/30 cursor-pointer">
              <div className="w-7.5 h-7.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#10b981] flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-xs font-bold truncate leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate leading-none mt-0.5">{currentUser.email}</span>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-200/30 dark:hover:bg-[#202222]/30 cursor-pointer text-slate-600 dark:text-slate-400"
            >
              <div className="w-7.5 h-7.5 rounded-full bg-slate-200 dark:bg-[#252727] flex items-center justify-center">
                <User size={14} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-xs font-bold truncate leading-tight">Guest Session</span>
                <span className="text-[9px] text-emerald-600 dark:text-[#10b981] font-semibold leading-none mt-0.5 hover:underline">Click to Sign In</span>
              </div>
            </div>
          )}
        </div>

      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR (collapsible layout) */}
      <SearchHistory isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* 3. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen relative">
        
        {/* Custom Header Navbar */}
        <div className="sticky top-0 right-0 w-full z-20 flex items-center justify-between bg-white/70 dark:bg-[#151616]/75 backdrop-blur-md border-b border-slate-200/80 dark:border-[#2d3030]/80 pr-6 pl-4 md:pl-6">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#202222] text-slate-500 cursor-pointer mr-2"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-grow">
            <Navbar />
          </div>
        </div>

        {/* Dynamic Inner Layout Page */}
        <main className="flex-grow flex flex-col justify-start">
          
          {/* VIEW 1: HERO / SEARCH BOX (Landing dashboard) */}
          {activeView === 'hero' && (
            <div className="flex-grow flex flex-col justify-center max-w-4xl mx-auto w-full gap-8 my-auto px-4 py-16">
              <Hero />

              <SearchBar autoFocus />

              {/* Trending suggestions */}
              <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full px-2 select-none">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                  <Sparkles size={11} className="text-emerald-500" />
                  <span>Trending Research Topics</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {trendingSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => triggerSearch(term)}
                      className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-full bg-white hover:bg-slate-100 dark:bg-[#1c1e1e] dark:hover:bg-[#202222] border border-slate-200/80 dark:border-[#2d3030]/85 text-slate-600 dark:text-slate-350 cursor-pointer shadow-sm hover:border-emerald-500/30 transition-all duration-150"
                    >
                      <span>{term}</span>
                      <ChevronRight size={12} className="text-slate-400 dark:text-slate-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MULTI-TURN CHAT CONVERSATION LOG (ChatGPT/Claude/Gemini style) */}
          {activeView === 'results' && (
            <div className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col justify-start gap-8">
              
              {/* Thread naming heading */}
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-[#2d3030]/40 select-none">
                <BookOpen size={16} className="text-emerald-500 shrink-0" />
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-445 dark:text-slate-500">
                  Research Thread: <span className="text-slate-600 dark:text-slate-300 font-semibold lowercase capitalize ml-1">{activeThread?.query}</span>
                </h2>
              </div>

              {/* Error messages block */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-slate-700 dark:text-slate-300">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div className="flex-grow text-xs sm:text-sm">
                    <p className="font-bold">Execution Warning</p>
                    <p className="mt-1 leading-normal text-slate-550 dark:text-slate-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Sequential Chat Message turns */}
              <div className="flex flex-col gap-8 flex-grow">
                {activeThread?.messages && activeThread.messages.map((message, messageIndex) => {
                  const isUser = message.sender === 'user';
                  
                  if (isUser) {
                    const isEditing = editingMessageId === message.id;
                    const { currentVersion, totalVersions, matchingPaths } = getVersionsAtMessageIndex(messageIndex);

                    // USER PROMPT MESSAGE TURN
                    return (
                      <div 
                        key={message.id}
                        className="flex flex-col gap-2 max-w-3xl self-start w-full border-l-3 border-emerald-500 dark:border-emerald-500/65 pl-4 py-1 my-2 group/msg relative"
                      >
                        <div className="flex items-center justify-between select-none">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
                            User Inquiry
                          </span>
                          
                          {/* Versions / Pagination Selector (ChatGPT/Claude style) */}
                          {!isEditing && totalVersions > 1 && (
                            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-[#1a1c1c] px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-[#2d3030]/40">
                              <button
                                disabled={currentVersion <= 1}
                                onClick={() => {
                                  if (currentVersion > 1) {
                                    switchThreadPath(activeThread!.id, matchingPaths[currentVersion - 2].pathIndex);
                                  }
                                }}
                                className="hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-500 transition-colors cursor-pointer"
                              >
                                <ChevronLeft size={10} />
                              </button>
                              <span>{currentVersion} / {totalVersions}</span>
                              <button
                                disabled={currentVersion >= totalVersions}
                                onClick={() => {
                                  if (currentVersion < totalVersions) {
                                    switchThreadPath(activeThread!.id, matchingPaths[currentVersion].pathIndex);
                                  }
                                }}
                                className="hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-slate-400 dark:disabled:hover:text-slate-500 transition-colors cursor-pointer"
                              >
                                <ChevronRight size={10} />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          // Inline editing layout
                          <div className="mt-2 w-full flex flex-col gap-2.5">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={2}
                              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-[#2d3030] bg-white dark:bg-[#1c1e1e] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-150 resize-none font-sans"
                            />
                            <div className="flex items-center gap-2 self-end">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#2d3030] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202222] font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  if (editText.trim() !== '' && editText.trim() !== message.text) {
                                    triggerSearch(editText, messageIndex);
                                  }
                                  setEditingMessageId(null);
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer animate-none"
                              >
                                Save & Submit
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Normal display layout
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight flex-1">
                              {message.text.replace(/\s*\[Reading file:.*?\]\s*$/, '').replace(/\s*\(Focus:.*?\)\s*$/, '')}
                            </h3>
                            
                            {/* Hover Edit Pencil button */}
                            <button
                              onClick={() => {
                                setEditingMessageId(message.id);
                                setEditText(message.text);
                              }}
                              className="opacity-0 group-hover/msg:opacity-100 p-1.5 rounded-lg border border-slate-250 dark:border-[#2d3030]/80 text-slate-450 hover:text-emerald-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#202222] transition-all duration-150 cursor-pointer select-none"
                              title="Edit question"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    // ASSISTANT ANSWER RESPONSE TURN
                    return (
                      <div 
                        key={message.id}
                        className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-200"
                      >
                        
                        {/* RAG references row for this response */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-550 text-[10.5px] font-bold uppercase tracking-wider pl-1 select-none">
                              <Globe size={13} className="text-emerald-500 shrink-0" />
                              <span>Verified Sources</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                              {message.sources.map((source, index) => (
                                <SourceCard 
                                  key={index} 
                                  source={source} 
                                  index={index + 1} 
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Double column grid for Answer Card & Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                          
                          {/* Main answer text card */}
                          <div className="lg:col-span-3 w-full">
                            <AnswerCard answer={message.text} />
                          </div>

                          {/* Stats metadata sidebar panel */}
                          {message.stats && (
                            <div className="lg:col-span-1 flex flex-col gap-4 w-full select-none text-slate-700 dark:text-slate-300">
                              <div className="bg-white dark:bg-[#1c1e1e] border border-slate-200/80 dark:border-[#2d3030]/80 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#2d3030]/40">
                                  <BarChart3 size={14} className="text-emerald-500" />
                                  <h3 className="font-extrabold text-[11px] uppercase tracking-wider">Research Details</h3>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 text-[11px]">
                                  
                                  {/* Speed */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wide">Search Speed</span>
                                    <span className="font-mono font-bold">{message.stats.searchTime} ms</span>
                                  </div>

                                  {/* Citations count */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-455 dark:text-slate-500 font-bold uppercase tracking-wide">Citations</span>
                                    <span className="font-mono font-bold">{message.stats.resultsCount} links</span>
                                  </div>

                                  {/* DB flag */}
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-455 dark:text-slate-500 font-bold uppercase tracking-wide">Storage</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-[#10b981] font-bold text-[8.5px] uppercase tracking-wider">Indexed</span>
                                  </div>

                                </div>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  }
                })}

                {/* Loading skeleton placeholder at the very end of conversation log */}
                {isLoading && (
                  <div className="w-full mt-2">
                    <LoadingSkeleton />
                  </div>
                )}

                {/* Auto-scroll anchor point */}
                <div ref={messagesEndRef} />
              </div>

              {/* Related follow-up suggestions (only shown for last turn!) */}
              {!isLoading && activeThread?.messages && activeThread.messages.length > 0 && (
                (() => {
                  const lastMessage = activeThread.messages[activeThread.messages.length - 1];
                  if (lastMessage.sender === 'assistant' && lastMessage.relatedQuestions) {
                    return (
                      <div className="w-full mt-4 animate-in fade-in duration-300">
                        <RelatedQuestions questions={lastMessage.relatedQuestions} />
                      </div>
                    );
                  }
                  return null;
                })()
              )}

              {/* Bottom Sticky Follow-up Input area */}
              {!isLoading && activeThread && (
                <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-slate-50/0 dark:from-[#151616] dark:via-[#151616]/95 dark:to-[#151616]/0 pt-6 pb-4 border-t border-slate-200/40 dark:border-[#2d3030]/25 mt-4">
                  <div className="flex flex-col gap-4">
                    <form
                      onSubmit={handleFollowUpSubmit}
                      className="bg-white dark:bg-[#1c1e1e] border border-slate-200/80 dark:border-[#2d3030]/80 rounded-xl p-3 flex items-center shadow-sm hover:border-emerald-500/30 focus-within:border-emerald-500/50 transition-all duration-200"
                    >
                      <CornerDownLeft size={15} className="text-slate-450 dark:text-slate-500 shrink-0 ml-2 select-none" />
                      <input
                        type="text"
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        placeholder="Ask follow-up research question..."
                        className="w-full bg-transparent border-0 outline-none px-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-[13.5px] focus:ring-0 py-1"
                      />
                      <button
                        type="submit"
                        disabled={followUp.trim() === '' || isLoading}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shrink-0 cursor-pointer ${
                          followUp.trim() === '' || isLoading
                            ? 'bg-slate-100 dark:bg-[#252727] text-slate-450 dark:text-slate-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600'
                        }`}
                      >
                        Ask
                      </button>
                    </form>

                    {/* Shared Research & Actions panel */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
                      <span>Nexora conversational research thread compiles active facts.</span>
                      <button
                        onClick={handleShareThread}
                        className="flex items-center gap-1.5 text-emerald-600 dark:text-[#10b981] font-semibold hover:underline cursor-pointer select-none"
                      >
                        {threadCopied ? (
                          <>
                            <Check size={11} className="text-emerald-500 animate-bounce" />
                            <span>Link copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={11} />
                            <span>Share full thread</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

        {/* Global bottom footer */}
        <Footer />

      </div>

      <AuthModal />
    </div>
  );
}
