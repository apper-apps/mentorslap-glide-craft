import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  actionText = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-64 text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} size={36} className="text-primary-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        <p className="text-slate-400 max-w-md">{description}</p>
      </div>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:brightness-110 transition-all btn-glow"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;