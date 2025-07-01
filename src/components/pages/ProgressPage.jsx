import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ProgressBar from '@/components/atoms/ProgressBar';
import XPDisplay from '@/components/molecules/XPDisplay';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { taskService } from '@/services/api/taskService';

const ProgressPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  const completedTasks = tasks.filter(task => task.status === 'done');
  const totalXP = completedTasks.reduce((sum, task) => sum + task.xpValue, 0);
  const currentLevel = Math.floor(totalXP / 200) + 1;
  const currentLevelXP = totalXP % 200;
  const nextLevelXP = 200;
  
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first task',
      icon: 'Target',
      unlocked: completedTasks.length >= 1,
      progress: Math.min(completedTasks.length, 1),
      total: 1
    },
    {
      id: 2,
      title: 'Getting Momentum',
      description: 'Complete 5 tasks',
      icon: 'Zap',
      unlocked: completedTasks.length >= 5,
      progress: Math.min(completedTasks.length, 5),
      total: 5
    },
    {
      id: 3,
      title: 'Task Master',
      description: 'Complete 20 tasks',
      icon: 'Award',
      unlocked: completedTasks.length >= 20,
      progress: Math.min(completedTasks.length, 20),
      total: 20
    },
    {
      id: 4,
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: 'Flame',
      unlocked: true, // Assuming user has 7-day streak
      progress: 7,
      total: 7
    },
    {
      id: 5,
      title: 'XP Hunter',
      description: 'Earn 500 total XP',
      icon: 'Star',
      unlocked: totalXP >= 500,
      progress: Math.min(totalXP, 500),
      total: 500
    },
    {
      id: 6,
      title: 'Level Up',
      description: 'Reach Level 3',
      icon: 'TrendingUp',
      unlocked: currentLevel >= 3,
      progress: Math.min(currentLevel, 3),
      total: 3
    }
  ];
  
  const weeklyProgress = [
    { day: 'Mon', tasks: 3, xp: 45 },
    { day: 'Tue', tasks: 2, xp: 30 },
    { day: 'Wed', tasks: 4, xp: 60 },
    { day: 'Thu', tasks: 1, xp: 15 },
    { day: 'Fri', tasks: 3, xp: 45 },
    { day: 'Sat', tasks: 2, xp: 30 },
    { day: 'Sun', tasks: 2, xp: 30 }
  ];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Progress Tracking</h1>
        <p className="text-slate-400 mt-1">See how far you've come and what's next</p>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - XP and Stats */}
        <div className="space-y-6">
          <XPDisplay
            currentXP={currentLevelXP}
            level={currentLevel}
            nextLevelXP={nextLevelXP}
            streak={7}
          />
          
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Your Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Tasks Completed', value: completedTasks.length, icon: 'CheckCircle' },
                { label: 'Total XP Earned', value: totalXP, icon: 'Zap' },
                { label: 'Current Level', value: currentLevel, icon: 'Star' },
                { label: 'Days Active', value: '12', icon: 'Calendar' }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={stat.icon} size={16} className="text-primary-400" />
                    <span className="text-sm text-slate-300">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-slate-100">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right Column - Achievements and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">This Week's Activity</h3>
            <div className="grid grid-cols-7 gap-3">
              {weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <div className="text-xs text-slate-400">{day.day}</div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold ${
                    day.tasks > 0 
                      ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {day.tasks}
                  </div>
                  <div className="text-xs text-slate-400">{day.xp} XP</div>
                </motion.div>
              ))}
            </div>
          </Card>
          
          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-accent-500/20 to-accent-600/20 border-accent-500/30'
                      : 'bg-slate-700/50 border-slate-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-accent-500 to-accent-600'
                        : 'bg-slate-600'
                    }`}>
                      <ApperIcon 
                        name={achievement.icon} 
                        size={20} 
                        className={achievement.unlocked ? 'text-white' : 'text-slate-400'} 
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-semibold ${
                          achievement.unlocked ? 'text-slate-100' : 'text-slate-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <Badge variant="accent" size="sm">Unlocked</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <ProgressBar
                          value={achievement.progress}
                          max={achievement.total}
                          size="sm"
                          variant="primary"
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;