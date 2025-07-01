import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-slate-700 text-slate-200',
    primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
    secondary: 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30',
    accent: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;