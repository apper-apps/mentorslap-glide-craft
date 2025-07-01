import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ isAppHeader = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
const navItems = isAppHeader 
    ? [
        { path: '/app', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/app/tasks', label: 'Tasks', icon: 'CheckSquare' },
        { path: '/app/progress', label: 'Progress', icon: 'TrendingUp' },
        { path: '/app/badges', label: 'Badges', icon: 'Award' },
        { path: '/app/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
        { path: '/app/resources', label: 'Resources', icon: 'BookOpen' }
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/pricing', label: 'Pricing' },
        { path: '#features', label: 'Features' },
        { path: '#about', label: 'About' }
      ];
  
  const isActive = (path) => {
    if (path === '/app' && location.pathname === '/app') return true;
    if (path !== '/app' && location.pathname === path) return true;
    return false;
  };
  
  return (
    <header className={`${isAppHeader ? 'bg-surface/90' : 'bg-background/90'} backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MentorSlap</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'text-primary-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.icon && <ApperIcon name={item.icon} size={16} />}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAppHeader ? (
              <>
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <ApperIcon name="Flame" className="text-accent-500" size={16} />
                  <span className="text-slate-300">7 day streak</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ApperIcon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-700 py-4"
          >
            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  } rounded-lg`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <ApperIcon name={item.icon} size={16} />}
                  <span>{item.label}</span>
                </Link>
              ))}
              {!isAppHeader && (
                <div className="pt-3 space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Log In
                  </Button>
                  <Button variant="primary" size="sm" className="w-full justify-start">
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;