import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { badgeService } from '@/services/api/badgeService';
import { taskService } from '@/services/api/taskService';
import BadgeGrid from '@/components/molecules/BadgeGrid';

const BadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const [badgesData, userBadgesData, tasksData] = await Promise.all([
        badgeService.getAll(),
        badgeService.getUserBadges(),
        taskService.getAll()
      ]);
      setBadges(badgesData);
      setUserBadges(userBadgesData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load badges data. Please try again.');
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

  const userProgress = {
    completedTasks: completedTasks.length,
    totalXP,
    currentLevel,
    streak: 7
  };

  const categories = [
    { id: 'all', label: 'All Badges', icon: 'Grid3X3' },
    { id: 'milestone', label: 'Milestones', icon: 'Target' },
    { id: 'streak', label: 'Streaks', icon: 'Flame' },
    { id: 'experience', label: 'Experience', icon: 'Star' }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);
  const earnedCount = earnedBadgeIds.length;
  const totalCount = badges.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Badge Collection</h1>
          <p className="text-slate-400 mt-1">Track your achievements and unlock new badges</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/app/leaderboard">
            <Button variant="outline" icon="Trophy">
              View Leaderboard
            </Button>
          </Link>
          <Link to="/app/progress">
            <Button variant="primary" icon="TrendingUp">
              Progress
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Badges Earned</p>
              <p className="text-2xl font-bold text-slate-100">{earnedCount}/{totalCount}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Completion Rate</p>
              <p className="text-2xl font-bold text-slate-100">{Math.round((earnedCount / totalCount) * 100)}%</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Current Streak</p>
              <p className="text-2xl font-bold text-slate-100">{userProgress.streak} days</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Current Level</p>
              <p className="text-2xl font-bold text-slate-100">{userProgress.currentLevel}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <ApperIcon name={category.icon} size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Badge Grid */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">
              {selectedCategory === 'all' ? 'All Badges' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <Badge variant="primary" size="sm">
              {filteredBadges.length} {filteredBadges.length === 1 ? 'badge' : 'badges'}
            </Badge>
          </div>
          
          <BadgeGrid 
            badges={filteredBadges} 
            userProgress={userProgress} 
            earnedBadgeIds={earnedBadgeIds}
          />
        </div>
      </Card>
    </div>
  );
};

export default BadgesPage;