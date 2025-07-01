import { toast } from 'react-toastify';

class ProjectTaskService {
  constructor() {
    this.tableName = 'project_task';
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
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "xp_value" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
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

      return response.data.map(task => ({
        Id: task.Id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        xpValue: task.xp_value || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date
      }));
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      toast.error("Failed to load project tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "xp_value" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
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

      const task = response.data;
      return {
        Id: task.Id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        xpValue: task.xp_value || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date
      };
    } catch (error) {
      console.error(`Error fetching project task with ID ${id}:`, error);
      toast.error("Failed to load project task");
      return null;
    }
  }

  async getByProjectId(projectId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "xp_value" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
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
          { fieldName: "CreatedOn", sorttype: "DESC" }
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

      return response.data.map(task => ({
        Id: task.Id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        xpValue: task.xp_value || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date
      }));
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      toast.error("Failed to load project tasks");
      return [];
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: taskData.title || 'New Project Task',
          title: taskData.title,
          description: taskData.description || '',
          xp_value: parseInt(taskData.xpValue) || parseInt(taskData.xp_value) || 0,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || taskData.due_date || null,
          project_id: parseInt(taskData.projectId) || parseInt(taskData.project_id)
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
          const newTask = successfulRecords[0].data;
          return {
            Id: newTask.Id,
            projectId: newTask.project_id,
            title: newTask.title,
            description: newTask.description,
            xpValue: newTask.xp_value || 0,
            status: newTask.status || 'todo',
            priority: newTask.priority || 'medium',
            dueDate: newTask.due_date
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating project task:", error);
      toast.error("Failed to create project task");
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (taskData.title !== undefined) {
        updateFields.title = taskData.title;
        updateFields.Name = taskData.title;
      }
      if (taskData.description !== undefined) updateFields.description = taskData.description;
      if (taskData.xpValue !== undefined) updateFields.xp_value = parseInt(taskData.xpValue);
      if (taskData.xp_value !== undefined) updateFields.xp_value = parseInt(taskData.xp_value);
      if (taskData.status !== undefined) updateFields.status = taskData.status;
      if (taskData.priority !== undefined) updateFields.priority = taskData.priority;
      if (taskData.dueDate !== undefined) updateFields.due_date = taskData.dueDate;
      if (taskData.due_date !== undefined) updateFields.due_date = taskData.due_date;
      if (taskData.projectId !== undefined) updateFields.project_id = parseInt(taskData.projectId);
      if (taskData.project_id !== undefined) updateFields.project_id = parseInt(taskData.project_id);

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
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            projectId: updatedTask.project_id,
            title: updatedTask.title,
            description: updatedTask.description,
            xpValue: updatedTask.xp_value || 0,
            status: updatedTask.status || 'todo',
            priority: updatedTask.priority || 'medium',
            dueDate: updatedTask.due_date
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating project task:", error);
      toast.error("Failed to update project task");
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
      console.error("Error deleting project task:", error);
      toast.error("Failed to delete project task");
      return false;
    }
  }
}

export const projectTaskService = new ProjectTaskService();