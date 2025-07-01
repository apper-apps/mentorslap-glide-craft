import mockData from '@/services/mockData/projectJournals.json';

let journalEntries = [...mockData.mockData];
let nextId = Math.max(...journalEntries.map(j => j.Id)) + 1;

export const projectJournalService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...journalEntries];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const entry = journalEntries.find(j => j.Id === parseInt(id));
    if (!entry) {
      throw new Error('Journal entry not found');
    }
    return { ...entry };
  },

  async getByProjectId(projectId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return journalEntries
      .filter(j => j.projectId === parseInt(projectId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newEntry = {
      ...entryData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    journalEntries.push(newEntry);
    return { ...newEntry };
  },

  async update(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = journalEntries.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    journalEntries[index] = {
      ...journalEntries[index],
      ...entryData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...journalEntries[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = journalEntries.findIndex(j => j.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    journalEntries.splice(index, 1);
    return true;
  }
};