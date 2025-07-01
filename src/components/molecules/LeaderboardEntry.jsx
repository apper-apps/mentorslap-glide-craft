import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const LeaderboardEntry = ({ entry }) => {
  const getRankStyle = (rank) => {
    if (rank <= 3) {
      const colors = {
        1: 'from-yellow-400 to-yellow-600',
        2: 'from-gray-300 to-gray-500', 
        3: 'from-yellow-600 to-yellow-800'
      };
      return `bg-gradient-to-br ${colors[rank]} text-white`;
    }
    return 'bg-slate-700 text-slate-300';
  };

  const getActivityStatus = (lastActive) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const hoursDiff = (now - lastActiveDate) / (1000 * 60 * 60);
    
    if (hoursDiff < 1) return { label: 'Active now', color: 'text-green-400' };
    if (hoursDiff < 24) return { label: 'Active today', color: 'text-green-400' };
    if (hoursDiff < 168) return { label: 'This week', color: 'text-yellow-400' };
    return { label: 'Inactive', color: 'text-slate-500' };
  };

  const activity = getActivityStatus(entry.lastActive);

  return (
    <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700/70 transition-all duration-200">
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getRankStyle(entry.rank)}`}>
          {entry.rank}
        </div>
        
        {/* User Info */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-slate-100">{entry.anonymousName}</h4>
            <div className={`w-2 h-2 rounded-full ${
              activity.color === 'text-green-400' ? 'bg-green-400' : 
              activity.color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-slate-500'
            }`} />
          </div>
          <p className={`text-xs ${activity.color}`}>{activity.label}</p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="flex items-center space-x-1 text-sm">
            <ApperIcon name="Zap" size={14} className="text-accent-400" />
            <span className="font-semibold text-slate-100">{entry.score}</span>
          </div>
          <div className="text-xs text-slate-400">XP</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center space-x-1 text-sm">
            <ApperIcon name="Award" size={14} className="text-yellow-400" />
            <span className="font-semibold text-slate-100">{entry.badgeCount}</span>
          </div>
          <div className="text-xs text-slate-400">Badges</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center space-x-1 text-sm">
            <ApperIcon name="CheckCircle" size={14} className="text-green-400" />
            <span className="font-semibold text-slate-100">{entry.tasksCompleted}</span>
          </div>
          <div className="text-xs text-slate-400">Tasks</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center space-x-1 text-sm">
            <ApperIcon name="Flame" size={14} className="text-orange-400" />
            <span className="font-semibold text-slate-100">{entry.streak}</span>
          </div>
          <div className="text-xs text-slate-400">Streak</div>
        </div>
        
        <Badge variant={entry.level >= 5 ? 'warning' : entry.level >= 3 ? 'accent' : 'primary'} size="sm">
          Lvl {entry.level}
        </Badge>
      </div>
    </div>
  );
};

export default LeaderboardEntry;