'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nexora-theme') as Theme;
    
    // Check system preference if no saved theme
    if (savedTheme) {
      setTheme(savedTheme);
      updateDocumentTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      updateDocumentTheme(systemTheme);
    }
    
    setMounted(true);
  }, []);

  const updateDocumentTheme = (currentTheme: Theme) => {
    const root = window.document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('nexora-theme', nextTheme);
    updateDocumentTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {/* Set custom background/text changes with transitions */}
      <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-800 dark:bg-[#151616] dark:text-slate-100">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
