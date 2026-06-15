'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Nexora Boundary: Uncaught react render fault:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-red-500/5 border border-red-500/10 rounded-2xl max-w-lg mx-auto my-12 shadow-sm">
          <AlertCircle className="text-red-500 mb-3" size={36} />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-none mb-2">Something went wrong</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm mb-4">
            An unexpected error occurred while rendering the page content.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs shadow-sm transition-all duration-150 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reload Platform</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
