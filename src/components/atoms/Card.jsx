import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  ...props 
}) => {
  const baseClasses = 'bg-surface rounded-xl border border-slate-700 transition-all duration-200';
  const hoverClasses = hover ? 'hover:border-slate-600 hover:shadow-lg' : '';
  const glowClasses = glow ? 'card-glow' : '';
  
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;