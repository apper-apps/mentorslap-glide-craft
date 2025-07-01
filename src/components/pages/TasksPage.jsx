import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { taskService } from '@/services/api/taskService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  const loadTasks = async () => {
    try {
      setError('');
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
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
      toast.success('Task completed! Keep the momentum going!');
    } catch (err) {
      setError('Failed to update task');
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      await loadTasks();
      toast.success('Task deleted');
    } catch (err) {
      setError('Failed to delete task');
    }
  };
  
  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError('Failed to move task');
    }
  };
  
  const generateAITasks = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTasks = [
        {
          title: 'Create landing page wireframes',
          description: 'Design the key sections and user flow for your product landing page',
          xpValue: 25,
          status: 'todo',
          priority: 'high',
          dueDate: new Date(Date.now() + 86400000).toISOString()
        },
        {
          title: 'Research competitor pricing',
          description: 'Analyze 5 similar products to establish competitive pricing strategy',
          xpValue: 15,
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(Date.now() + 172800000).toISOString()
        }
      ];
      
      for (const task of newTasks) {
        await taskService.create(task);
      }
      
      await loadTasks();
      toast.success('🎉 AI generated 2 new personalized tasks!');
    } catch (err) {
      setError('Failed to generate tasks');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);
  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
    { id: 'done', title: 'Done', status: 'done' }
  ];
  
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Task Board</h1>
          <p className="text-slate-400 mt-1">Manage your roadmap tasks and track progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Plus">
            Add Task
          </Button>
          <Button variant="primary" icon="Brain" onClick={generateAITasks}>
            Generate AI Tasks
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, icon: 'List' },
          { label: 'To Do', value: getTasksByStatus('todo').length, icon: 'Circle' },
          { label: 'In Progress', value: getTasksByStatus('in_progress').length, icon: 'Clock' },
          { label: 'Completed', value: getTasksByStatus('done').length, icon: 'CheckCircle' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name={stat.icon} size={20} className="text-primary-400" />
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-100">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Kanban Board */}
      {tasks.length === 0 ? (
        <Empty
          title="No tasks yet"
          description="Start by generating AI tasks or creating your first task manually"
          actionText="Generate AI Tasks"
          onAction={generateAITasks}
          icon="CheckSquare"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: columns.indexOf(column) * 0.1 }}
                className="space-y-4"
              >
                {/* Column Header */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-100">{column.title}</h3>
                    <div className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full text-sm font-medium">
                      {columnTasks.length}
                    </div>
                  </div>
                </Card>
                
                {/* Column Tasks */}
                <div className="space-y-3 min-h-96">
                  {columnTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  ) : (
                    columnTasks.map((task, index) => (
                      <motion.div
                        key={task.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <TaskCard
                          task={task}
                          onComplete={handleCompleteTask}
                          onDelete={handleDeleteTask}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TasksPage;