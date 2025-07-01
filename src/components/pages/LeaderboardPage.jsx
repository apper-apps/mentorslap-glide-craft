import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { leaderboardService } from '@/services/api/leaderboardService';
import LeaderboardEntry from '@/components/molecules/LeaderboardEntry';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('all');

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await leaderboardService.getAll();
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const timeframes = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' }
  ];

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Leaderboard</h1>
          <p className="text-slate-400 mt-1">See how you rank against other builders</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/app/badges">
            <Button variant="outline" icon="Award">
              View Badges
            </Button>
          </Link>
          <Link to="/app/progress">
            <Button variant="primary" icon="TrendingUp">
              Your Progress
            </Button>
          </Link>
        </div>
      </div>

      {/* Timeframe Filter */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Rankings</h3>
          <div className="flex space-x-2">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  timeframe === tf.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <Card className="p-8">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((entry, index) => (
            <motion.div
              key={entry.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`text-center space-y-4 ${
                index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'
              }`}
            >
              <div className={`relative inline-block ${
                index === 0 ? 'scale-110' : ''
              }`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
                  index === 0 
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' 
                    : index === 1
                    ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900'
                    : 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-yellow-100'
                }`}>
                  {entry.rank}
                </div>
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 
                    ? 'bg-yellow-500' 
                    : index === 1
                    ? 'bg-gray-400'
                    : 'bg-yellow-700'
                }`}>
                  <ApperIcon 
                    name={index === 0 ? 'Crown' : 'Award'} 
                    size={16} 
                    className="text-white" 
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-100 text-lg">{entry.anonymousName}</h4>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Zap" size={14} />
                    <span>{entry.score} XP</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Award" size={14} />
                    <span>{entry.badgeCount}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Full Leaderboard */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">Full Rankings</h3>
        <div className="space-y-2">
          {remaining.map((entry, index) => (
            <motion.div
              key={entry.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <LeaderboardEntry entry={entry} />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Your Stats */}
      <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-500/20">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="User" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Your Performance</h3>
            <p className="text-sm text-slate-400">Keep building to climb the ranks!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">#12</div>
            <div className="text-xs text-slate-400">Your Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-100">450</div>
            <div className="text-xs text-slate-400">Your XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-400">3</div>
            <div className="text-xs text-slate-400">Your Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">7</div>
            <div className="text-xs text-slate-400">Day Streak</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeaderboardPage;