import { toast } from 'react-toastify';

class ProjectJournalService {
  constructor() {
    this.tableName = 'project_journal';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(entry => ({
        Id: entry.Id,
        projectId: entry.project_id,
        content: entry.content,
        date: entry.date
      }));
    } catch (error) {
      console.error("Error fetching project journal entries:", error);
      toast.error("Failed to load journal entries");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "project_id" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const entry = response.data;
      return {
        Id: entry.Id,
        projectId: entry.project_id,
        content: entry.content,
        date: entry.date
      };
    } catch (error) {
      console.error(`Error fetching journal entry with ID ${id}:`, error);
      toast.error("Failed to load journal entry");
      return null;
    }
  }

  async getByProjectId(projectId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "date" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(entry => ({
        Id: entry.Id,
        projectId: entry.project_id,
        content: entry.content,
        date: entry.date
      }));
    } catch (error) {
      console.error("Error fetching project journal entries:", error);
      toast.error("Failed to load journal entries");
      return [];
    }
  }

  async create(entryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `Journal Entry - ${new Date().toLocaleDateString()}`,
          content: entryData.content,
          date: entryData.date || new Date().toISOString(),
          project_id: parseInt(entryData.projectId) || parseInt(entryData.project_id)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newEntry = successfulRecords[0].data;
          return {
            Id: newEntry.Id,
            projectId: newEntry.project_id,
            content: newEntry.content,
            date: newEntry.date
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to create journal entry");
      throw error;
    }
  }

  async update(id, entryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (entryData.content !== undefined) updateFields.content = entryData.content;
      if (entryData.date !== undefined) updateFields.date = entryData.date;
      if (entryData.projectId !== undefined) updateFields.project_id = parseInt(entryData.projectId);
      if (entryData.project_id !== undefined) updateFields.project_id = parseInt(entryData.project_id);

      const params = {
        records: [updateFields]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedEntry = successfulUpdates[0].data;
          return {
            Id: updatedEntry.Id,
            projectId: updatedEntry.project_id,
            content: updatedEntry.content,
            date: updatedEntry.date
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating journal entry:", error);
      toast.error("Failed to update journal entry");
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length === 1;
      }

      return false;
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast.error("Failed to delete journal entry");
      return false;
    }
  }
}

export const projectJournalService = new ProjectJournalService();