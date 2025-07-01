import { mockData } from '@/services/mockData/resources.json';

class ResourceService {
  constructor() {
    this.resources = [...mockData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...this.resources];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const resource = this.resources.find(r => r.Id === parseInt(id));
    if (!resource) {
      throw new Error('Resource not found');
    }
    return { ...resource };
  }

  async create(resourceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.resources.map(r => r.Id), 0) + 1;
    const newResource = {
      Id: newId,
      ...resourceData,
      createdAt: new Date().toISOString()
    };
    this.resources.push(newResource);
    return { ...newResource };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.resources.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Resource not found');
    }
    this.resources[index] = { ...this.resources[index], ...updateData };
    return { ...this.resources[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.resources.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Resource not found');
    }
    this.resources.splice(index, 1);
    return true;
  }
}

export const resourceService = new ResourceService();