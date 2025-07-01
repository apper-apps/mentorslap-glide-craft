import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: 'from-primary-500 to-secondary-500',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-green-600'
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-400">{value}/{max}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-700 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`bg-gradient-to-r ${variants[variant]} ${sizes[size]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;