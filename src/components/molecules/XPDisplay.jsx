import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';

const XPDisplay = ({ currentXP, level, nextLevelXP, streak }) => {
  const levelLabels = {
    1: 'Builder',
    2: 'Hustler', 
    3: 'Launcher',
    4: 'Entrepreneur',
    5: 'Visionary'
  };
  
  return (
    <div className="bg-surface rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Level Progress</h3>
          <p className="text-slate-400">Keep building momentum!</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">Level {level}</div>
          <div className="text-sm text-slate-400">{levelLabels[level] || 'Master'}</div>
        </div>
      </div>
      
      <ProgressBar
        value={currentXP}
        max={nextLevelXP}
        label="XP Progress"
        variant="accent"
        size="lg"
      />
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Flame" className="text-accent-500" size={20} />
          <span className="text-slate-300">
            <span className="font-semibold text-accent-500">{streak}</span> day streak
          </span>
        </div>
        <div className="text-sm text-slate-400">
          {nextLevelXP - currentXP} XP to next level
        </div>
      </div>
    </div>
  );
};

export default XPDisplay;