import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  title = "Oops!"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-64 text-center space-y-4"
    >
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        <p className="text-slate-400 max-w-md">{message}</p>
      </div>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors btn-glow"
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;