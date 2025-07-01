import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:brightness-110 focus:ring-primary-500 btn-glow',
    secondary: 'bg-surface text-slate-200 border border-slate-600 hover:border-slate-500 hover:bg-slate-700 focus:ring-slate-500',
    outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    ghost: 'text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:brightness-110 focus:ring-accent-500 btn-glow'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      ) : icon ? (
        <ApperIcon name={icon} size={16} className="mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;