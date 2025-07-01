import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'dashboard' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-8 bg-slate-700 rounded-lg w-48 animate-pulse" />
              <div className="h-10 bg-slate-700 rounded-lg w-32 animate-pulse" />
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-xl p-6 space-y-3">
                  <div className="h-4 bg-slate-600 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-slate-600 rounded w-16 animate-pulse" />
                  <div className="h-2 bg-slate-700 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
            
            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface rounded-xl p-6 space-y-4">
                <div className="h-6 bg-slate-600 rounded w-32 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
              
              <div className="bg-surface rounded-xl p-6 space-y-4">
                <div className="h-6 bg-slate-600 rounded w-28 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-slate-600 rounded animate-pulse" />
                      <div className="h-4 bg-slate-600 rounded flex-1 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'tasks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Todo', 'In Progress', 'Done'].map((column) => (
              <div key={column} className="space-y-4">
                <div className="h-6 bg-slate-600 rounded w-24 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-surface rounded-lg p-4 space-y-2">
                      <div className="h-5 bg-slate-600 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-slate-700 rounded w-full animate-pulse" />
                      <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <motion.div
              className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        );
    }
  };

  return (
    <div className="animate-pulse">
      {renderSkeleton()}
    </div>
  );
};

export default Loading;