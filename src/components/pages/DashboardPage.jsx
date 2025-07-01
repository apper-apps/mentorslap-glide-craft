import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import XPDisplay from '@/components/molecules/XPDisplay';
import TaskCard from '@/components/molecules/TaskCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const loadTasks = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadTasks();
  }, []);
  
const handleCompleteTask = async (taskId) => {
    try {
      await taskService.update(taskId, { status: 'done' });
      await loadTasks();
      toast.success('Task completed! Great work! 🎉');
    } catch (err) {
      setError('Failed to update task');
      toast.error('Failed to complete task. Please try again.');
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      await loadTasks();
      toast.success('Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task. Please try again.');
    }
  };
  
  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  
  const todayTasks = tasks.filter(task => task.status === 'todo').slice(0, 3);
  const completedToday = tasks.filter(task => task.status === 'done').length;
  const totalXP = tasks.filter(task => task.status === 'done').reduce((sum, task) => sum + task.xpValue, 0);
  
  const stats = [
    {
      label: 'Tasks Completed Today',
      value: completedToday,
      icon: 'CheckCircle',
      color: 'text-green-400'
    },
    {
      label: 'Current Streak',
      value: '7 days',
      icon: 'Flame',
      color: 'text-accent-500'
    },
    {
      label: 'Total XP Earned',
      value: totalXP,
      icon: 'Zap',
      color: 'text-accent-500'
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Welcome back, <span className="gradient-text">Builder</span>!
          </h1>
          <p className="text-slate-400 mt-1">Ready to make progress on your goals today?</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/app/tasks">
            <Button variant="outline" icon="Plus">
              Add Task
            </Button>
          </Link>
          <Button variant="primary" icon="Brain">
            Generate Tasks
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - XP and Quick Actions */}
        <div className="space-y-6">
          <XPDisplay
            currentXP={450}
            level={2}
            nextLevelXP={600}
            streak={7}
          />
          
          {/* Daily Motivation */}
          <Card className="p-6" glow>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageCircle" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Today's Motivation Slap</h3>
                  <p className="text-xs text-slate-400">Your daily dose of momentum</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                "The difference between successful entrepreneurs and dreamers? 
                Successful ones ship broken things and fix them later. What can you ship today?"
              </p>
              <Button variant="accent" size="sm" className="w-full">
                Get Another Slap
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Right Column - Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-100">Next Actions</h2>
            <Link to="/app/tasks" className="text-primary-400 hover:text-primary-300 text-sm">
              View all tasks →
            </Link>
          </div>
          
          {todayTasks.length === 0 ? (
            <Empty
              title="All caught up!"
              description="You've completed all your tasks for today. Time to add more or take a well-deserved break."
              actionText="Add New Task"
              onAction={() => {}}
              icon="CheckCircle"
            />
          ) : (
            <div className="space-y-4">
              {todayTasks.map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Roadmap Preview */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">Your Roadmap Progress</h3>
                <Button variant="ghost" size="sm" icon="ExternalLink">
                  View Roadmap
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Launch MVP</span>
                  <span className="text-sm text-slate-400">60% complete</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;