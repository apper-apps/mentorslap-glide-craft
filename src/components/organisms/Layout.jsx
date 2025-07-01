import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', path: '/app', icon: 'LayoutDashboard' },
    { name: 'Tasks', path: '/app/tasks', icon: 'CheckSquare' },
    { name: 'Progress', path: '/app/progress', icon: 'TrendingUp' },
    { name: 'Resources', path: '/app/resources', icon: 'BookOpen' },
  ];
  
  const isActive = (path) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
{/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-slate-700">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MentorSlap</span>
            </Link>
          </div>
          
          {/* User Info */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-100">John Doe</div>
                <div className="text-xs text-slate-400">Level 2 Hustler</div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Zap" className="text-accent-500" size={14} />
                  <span className="text-xs text-slate-400">XP</span>
                </div>
                <div className="text-lg font-bold text-accent-500">450</div>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Flame" className="text-accent-500" size={14} />
                  <span className="text-xs text-slate-400">Streak</span>
                </div>
                <div className="text-lg font-bold text-accent-500">7</div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Bottom Section */}
          <div className="p-6 border-t border-slate-700">
            <Link
              to="/"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              <ApperIcon name="ArrowLeft" size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-slate-700 lg:hidden">
          <div className="flex items-center h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ApperIcon name="Menu" size={24} />
            </button>
            <div className="ml-4">
              <h1 className="text-lg font-semibold text-slate-100">
                {navigation.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="min-h-screen p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;