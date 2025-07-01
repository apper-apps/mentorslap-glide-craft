import mockData from '@/services/mockData/projects.json';

let projects = [...mockData.mockData];
let nextId = Math.max(...projects.map(p => p.Id)) + 1;

export const projectService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...projects];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProject = {
      ...projectData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects[index] = {
      ...projects[index],
      ...projectData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...projects[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects.splice(index, 1);
    return true;
  }
};