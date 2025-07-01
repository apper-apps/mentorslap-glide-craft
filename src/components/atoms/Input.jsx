import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 bg-surface border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconClasses = icon ? 'pl-11' : '';
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={18} className="text-slate-400" />
          </div>
        )}
        <input
          type={type}
          className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;