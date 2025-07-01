import mockData from '@/services/mockData/projectTasks.json';

let projectTasks = [...mockData.mockData];
let nextId = Math.max(...projectTasks.map(t => t.Id)) + 1;

export const projectTaskService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projectTasks];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const task = projectTasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return projectTasks.filter(t => t.projectId === parseInt(projectId));
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTask = {
      ...taskData,
      Id: nextId++,
      status: taskData.status || 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projectTasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projectTasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    projectTasks[index] = {
      ...projectTasks[index],
      ...taskData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...projectTasks[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projectTasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    projectTasks.splice(index, 1);
    return true;
  }
};