'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ThreadRecord, HistoryItem, ChatMessage, User } from '../types/index';

interface SearchContextType {
  query: string;
  activeThread: ThreadRecord | null;
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  activeView: 'hero' | 'results';
  triggerSearch: (searchQuery: string, editMessageIndex?: number) => Promise<void>;
  fetchHistory: () => Promise<void>;
  viewThreadDetails: (id: string) => Promise<void>;
  clearSearch: () => void;
  // User Authentication
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  // Conversational Branching
  switchThreadPath: (threadId: string, pathIndex: number) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState('');
  const [activeThread, setActiveThread] = useState<ThreadRecord | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'hero' | 'results'>('hero');

  // User Auth States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Restore session and load history on mount
  useEffect(() => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_BASE}/auth/me`)
        .then(response => {
          if (response.data) {
            setCurrentUser(response.data);
          }
        })
        .catch(err => {
          console.warn('Nexora Auth: Invalid session token removed.', err.message);
          localStorage.removeItem('nexora_token');
          delete axios.defaults.headers.common['Authorization'];
        });
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`);
      if (response.data) {
        setHistory(response.data);
      }
    } catch (error: unknown) {
      console.error('Nexora Client: Failed to retrieve history:', getErrorMessage(error, 'Failed to retrieve history'));
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('nexora_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setCurrentUser(response.data.user);
        setAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Invalid credentials');
      console.error('Nexora Auth: Login error:', message);
      throw new Error(message);
    }
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('nexora_token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setCurrentUser(response.data.user);
        setAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to register account');
      console.error('Nexora Auth: Registration error:', message);
      throw new Error(message);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('nexora_token');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    console.log('Nexora Auth: User logged out');
  };

  const switchThreadPath = async (threadId: string, pathIndex: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/search/switch-path`, { threadId, pathIndex });
      if (response.data) {
        setActiveThread(response.data);
        if (response.data.query) {
          setQuery(response.data.query);
        }
      }
    } catch (error: unknown) {
      console.error('Nexora Client: Branch switch error:', getErrorMessage(error, 'Failed to switch conversation version.'));
      setError('Failed to switch conversation version.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerSearch = async (searchQuery: string, editMessageIndex?: number) => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const cleanQuery = searchQuery.trim();
    setIsLoading(true);
    setError(null);
    setQuery(cleanQuery);
    setActiveView('results');

    // Create a temporary user message to show instantly in chat logs (ChatGPT style!)
    const tempUserMsg: ChatMessage = {
      id: `msg_temp_usr_${Date.now()}`,
      sender: 'user',
      text: cleanQuery,
      createdAt: new Date().toISOString()
    };

    // Append to local state immediately so user sees their input in the running conversation
    if (activeThread) {
      const prefix = typeof editMessageIndex === 'number' 
        ? activeThread.messages.slice(0, editMessageIndex)
        : activeThread.messages;
      setActiveThread({
        ...activeThread,
        messages: [...prefix, tempUserMsg]
      });
    } else {
      // Mock temporary thread while waiting for first response
      setActiveThread({
        id: 'temp_thread_id',
        query: cleanQuery,
        messages: [tempUserMsg],
        createdAt: new Date().toISOString()
      });
    }

    try {
      // Send threadId if continuing, otherwise undefined
      const payload = {
        query: cleanQuery,
        threadId: activeThread && activeThread.id !== 'temp_thread_id' ? activeThread.id : undefined,
        editMessageIndex
      };

      const response = await axios.post(`${API_BASE}/search`, payload);
      if (response.data) {
        setActiveThread(response.data);
        fetchHistory(); // Refresh recent threads
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Connection to the Nexora research backend failed. Please ensure the backend server is running on port 5001.');
      console.error('Nexora Client: Search execution error:', message);
      setError('Connection to the Nexora research backend failed. Please ensure the backend server is running on port 5001.');
      
      // Fallback local simulated assistant response
      const fallbackAstMsg: ChatMessage = {
        id: `msg_temp_ast_${Date.now()}`,
        sender: 'assistant',
        text: `### Connection to Nexora Server Failed\n\nUnable to reach the Express backend server on port 5001. Here is a simulated response for **"${cleanQuery}"** to keep you moving forward. Please ensure your backend server is running.\n\nTo troubleshoot:\n1. Open your terminal in the backend directory.\n2. Run \`npm run dev\` to launch the server.\n3. Verify there are no port conflicts.`,
        sources: [
          {
            title: "Local Troubleshooting Guide",
            url: "http://localhost:5001",
            snippet: "The backend server is responsible for parsing your questions and returning answers with citations. Currently it appears to be offline."
          }
        ],
        relatedQuestions: [
          "How do I start the backend server?",
          "How to configure port bindings?",
          "Can I run Nexora AI without PostgreSQL?"
        ],
        stats: {
          searchTime: 120,
          resultsCount: 1
        },
        createdAt: new Date().toISOString()
      };

      if (activeThread) {
        const prefix = typeof editMessageIndex === 'number' 
          ? activeThread.messages.slice(0, editMessageIndex)
          : activeThread.messages;
        const listWithoutTemp = prefix.filter(m => !m.id.startsWith('msg_temp_usr_'));
        const list = [...listWithoutTemp, tempUserMsg];
        
        setActiveThread({
          ...activeThread,
          messages: [...list, fallbackAstMsg]
        });
      } else {
        setActiveThread({
          id: 'mock_unreachable',
          query: cleanQuery,
          messages: [tempUserMsg, fallbackAstMsg],
          createdAt: new Date().toISOString()
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const viewThreadDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);
    setActiveView('results');
    setActiveThread(null);

    try {
      const response = await axios.get(`${API_BASE}/search/${id}`);
      if (response.data) {
        setActiveThread(response.data);
        if (response.data.query) {
          setQuery(response.data.query);
        }
      }
    } catch (error: unknown) {
      console.error('Nexora Client: Failed to retrieve thread detail:', getErrorMessage(error, 'Failed to retrieve thread detail'));
      // Fallback
      const fallbackItem = history.find(h => h.id === id);
      if (fallbackItem) {
        triggerSearch(fallbackItem.query);
      } else {
        setError('Failed to fetch the research thread from backend.');
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setActiveThread(null);
    setError(null);
    setActiveView('hero');
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        activeThread,
        history,
        isLoading,
        error,
        activeView,
        triggerSearch,
        fetchHistory,
        viewThreadDetails,
        clearSearch,
        currentUser,
        isAuthModalOpen,
        setAuthModalOpen,
        loginUser,
        registerUser,
        logoutUser,
        switchThreadPath
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
