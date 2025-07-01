import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const TaskCard = ({ task, onComplete, onDelete, isDragging = false }) => {
  const handleComplete = () => {
    onComplete(task.Id);
    toast.success(`+${task.xpValue} XP! Task completed!`, {
      icon: '🎉'
    });
  };
  
  const priorityColors = {
    low: 'success',
    medium: 'accent', 
    high: 'error'
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      className={`bg-surface rounded-lg p-4 border border-slate-700 space-y-3 cursor-pointer transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-slate-100 flex-1">{task.title}</h4>
        <div className="flex items-center space-x-2 ml-2">
          <Badge variant={priorityColors[task.priority]} size="sm">
            {task.priority}
          </Badge>
          <button
            onClick={() => onDelete(task.Id)}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-slate-400">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-accent-500">
            <ApperIcon name="Zap" size={16} />
            <span className="text-sm font-medium">{task.xpValue} XP</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center space-x-1 text-slate-400">
              <ApperIcon name="Calendar" size={16} />
              <span className="text-sm">{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        {task.status !== 'done' && (
          <Button
            size="sm"
            variant="accent"
            onClick={handleComplete}
            icon="Check"
          >
            Complete
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;