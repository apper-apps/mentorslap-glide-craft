import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import TaskCard from '@/components/molecules/TaskCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { projectService } from '@/services/api/projectService';
import { projectTaskService } from '@/services/api/projectTaskService';
import { projectJournalService } from '@/services/api/projectJournalService';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [newEntry, setNewEntry] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active'
  });

  const loadProjects = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (projectId) => {
    if (!projectId) return;
    try {
      const [tasks, journals] = await Promise.all([
        projectTaskService.getByProjectId(projectId),
        projectJournalService.getByProjectId(projectId)
      ]);
      setProjectTasks(tasks);
      setJournalEntries(journals);
    } catch (err) {
      toast.error('Failed to load project data');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectData(selectedProject.Id);
    }
  }, [selectedProject]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    try {
      const newProject = await projectService.create(formData);
      await loadProjects();
      setSelectedProject(newProject);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', status: 'active' });
      toast.success('Project created successfully!');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    try {
      await projectService.update(editingProject.Id, formData);
      await loadProjects();
      setShowEditModal(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', status: 'active' });
      toast.success('Project updated successfully!');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks and journal entries.')) {
      return;
    }

    try {
      await projectService.delete(projectId);
      await loadProjects();
      if (selectedProject?.Id === projectId) {
        setSelectedProject(projects.find(p => p.Id !== projectId) || null);
      }
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await projectTaskService.update(taskId, { status: 'done' });
      await loadProjectData(selectedProject.Id);
      toast.success('Task completed! Great job!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await projectTaskService.delete(taskId);
      await loadProjectData(selectedProject.Id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddJournalEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) {
      toast.error('Journal entry cannot be empty');
      return;
    }

    try {
      await projectJournalService.create({
        projectId: selectedProject.Id,
        content: newEntry,
        date: new Date().toISOString()
      });
      await loadProjectData(selectedProject.Id);
      setNewEntry('');
      toast.success('Journal entry added!');
    } catch (err) {
      toast.error('Failed to add journal entry');
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status
    });
    setShowEditModal(true);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadProjects} />;

  const pendingTasks = projectTasks.filter(task => task.status !== 'done');
  const completedTasks = projectTasks.filter(task => task.status === 'done');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400 mt-1">Organize your tasks and thoughts by project</p>
        </div>
        <Button 
          variant="primary" 
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
        >
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Projects Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">All Projects</h2>
          {projects.length === 0 ? (
            <Empty
              title="No projects yet"
              description="Create your first project to get started"
              actionText="Create Project"
              onAction={() => setShowCreateModal(true)}
              icon="FolderPlus"
            />
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <Card
                  key={project.Id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedProject?.Id === project.Id 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-100">{project.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(project);
                        }}
                        className="text-slate-400 hover:text-primary-400 transition-colors"
                      >
                        <ApperIcon name="Edit2" size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.Id);
                        }}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        {selectedProject ? (
          <div className="lg:col-span-3 space-y-6">
            {/* Project Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedProject.title}</h2>
                  <p className="text-slate-400 mt-2">{selectedProject.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-500">{pendingTasks.length}</div>
                    <div className="text-sm text-slate-400">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{completedTasks.length}</div>
                    <div className="text-sm text-slate-400">Completed</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex space-x-1 bg-surface rounded-lg p-1">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <ApperIcon name="CheckSquare" size={16} className="inline mr-2" />
                Tasks
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'journal'
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <ApperIcon name="BookOpen" size={16} className="inline mr-2" />
                Journal
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'tasks' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">Project Tasks</h3>
                  <Button 
                    variant="outline" 
                    icon="Plus" 
                    size="sm"
                    onClick={() => toast.info('Task creation will be integrated with the existing task system')}
                  >
                    Add Task
                  </Button>
                </div>
                
                {projectTasks.length === 0 ? (
                  <Empty
                    title="No tasks yet"
                    description="Add tasks to track progress on this project"
                    actionText="Add First Task"
                    onAction={() => toast.info('Task creation will be integrated with the existing task system')}
                    icon="CheckSquare"
                  />
                ) : (
                  <div className="space-y-4">
                    {projectTasks.map((task) => (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">Project Journal</h3>
                  <span className="text-sm text-slate-400">{journalEntries.length} entries</span>
                </div>

                {/* Add Entry Form */}
                <Card className="p-4">
                  <form onSubmit={handleAddJournalEntry} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        New Journal Entry
                      </label>
                      <textarea
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="Write about your progress, ideas, or thoughts on this project..."
                        className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="primary" icon="Plus" size="sm">
                        Add Entry
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Journal Entries */}
                {journalEntries.length === 0 ? (
                  <Empty
                    title="No journal entries yet"
                    description="Start documenting your project journey and insights"
                    actionText="Write First Entry"
                    onAction={() => document.querySelector('textarea')?.focus()}
                    icon="BookOpen"
                  />
                ) : (
                  <div className="space-y-4">
                    {journalEntries.map((entry) => (
                      <motion.div
                        key={entry.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <ApperIcon name="Calendar" size={16} />
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                              <span>{new Date(entry.date).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {entry.content}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : projects.length > 0 ? (
          <div className="lg:col-span-3 flex items-center justify-center h-96">
            <Empty
              title="Select a project"
              description="Choose a project from the sidebar to view its tasks and journal"
              icon="FolderOpen"
            />
          </div>
        ) : null}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-6 w-full max-w-md border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-100">Create New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <Input
                label="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[80px] resize-y"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Create Project
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-6 w-full max-w-md border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-100">Edit Project</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProject} className="space-y-4">
              <Input
                label="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title..."
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 min-h-[80px] resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Update Project
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;