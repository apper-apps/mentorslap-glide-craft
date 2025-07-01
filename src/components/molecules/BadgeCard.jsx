import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import ProgressBar from '@/components/atoms/ProgressBar';

const BadgeCard = ({ badge, userProgress, isEarned }) => {
  const getBadgeProgress = (badge, userProgress) => {
    switch (badge.Id) {
      case 1: // First Steps
        return { current: Math.min(userProgress.completedTasks, 1), total: 1 };
      case 2: // Getting Momentum
        return { current: Math.min(userProgress.completedTasks, 5), total: 5 };
      case 3: // Task Master
        return { current: Math.min(userProgress.completedTasks, 20), total: 20 };
      case 4: // Streak Master
        return { current: Math.min(userProgress.streak, 3), total: 3 };
      case 5: // Productive
        return { current: Math.min(userProgress.completedTasks, 10), total: 10 };
      case 6: // XP Hunter
        return { current: Math.min(userProgress.totalXP, 500), total: 500 };
      case 7: // XP Champion
        return { current: Math.min(userProgress.totalXP, 1000), total: 1000 };
      default:
        return { current: 0, total: 1 };
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600';
      case 'uncommon': return 'from-green-500 to-green-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-yellow-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const progress = getBadgeProgress(badge, userProgress);
  const progressPercentage = (progress.current / progress.total) * 100;

  return (
    <div className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${
      isEarned
        ? 'bg-gradient-to-br from-accent-500/20 to-accent-600/20 border-accent-500/30 shadow-accent-500/10'
        : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
          isEarned
            ? `bg-gradient-to-br ${getRarityColor(badge.rarity)}`
            : 'bg-slate-600'
        }`}>
          <ApperIcon 
            name={badge.icon} 
            size={24} 
            className={isEarned ? 'text-white' : 'text-slate-400'} 
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className={`font-semibold ${
              isEarned ? 'text-slate-100' : 'text-slate-400'
            }`}>
              {badge.name}
            </h4>
            {isEarned && (
              <Badge variant="accent" size="sm">Earned</Badge>
            )}
          </div>
          
          <p className="text-sm text-slate-400">{badge.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{badge.requirement}</span>
              <span className={`font-medium ${
                isEarned ? 'text-accent-400' : 'text-slate-400'
              }`}>
                {progress.current}/{progress.total}
              </span>
            </div>
            
            {!isEarned && (
              <ProgressBar
                value={progress.current}
                max={progress.total}
                size="sm"
                variant="primary"
              />
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant={badge.rarity === 'legendary' ? 'warning' : badge.rarity === 'epic' ? 'accent' : 'secondary'} 
              size="sm"
            >
              {badge.rarity}
            </Badge>
            <span className="text-xs text-slate-500">{badge.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;