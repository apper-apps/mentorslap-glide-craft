import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task';
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
          { field: { Name: "user_id" } },
          { field: { Name: "column" } }
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

      // Map database fields to UI expected format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title,
        description: task.description,
        xpValue: task.xp_value || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        userId: task.user_id,
        column: task.column || task.status
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
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
          { field: { Name: "user_id" } },
          { field: { Name: "column" } }
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

      // Map database fields to UI expected format
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title,
        description: task.description,
        xpValue: task.xp_value || 0,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.due_date,
        userId: task.user_id,
        column: task.column || task.status
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to load task");
      return null;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: taskData.title || taskData.Name || 'New Task',
          title: taskData.title,
          description: taskData.description || '',
          xp_value: parseInt(taskData.xpValue) || parseInt(taskData.xp_value) || 0,
          status: taskData.status || 'todo',
          priority: taskData.priority || 'medium',
          due_date: taskData.dueDate || taskData.due_date || null,
          user_id: taskData.userId || taskData.user_id || null,
          column: taskData.column || taskData.status || 'todo'
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
          toast.success('Task created successfully!');
          return {
            Id: newTask.Id,
            title: newTask.title,
            description: newTask.description,
            xpValue: newTask.xp_value || 0,
            status: newTask.status || 'todo',
            priority: newTask.priority || 'medium',
            dueDate: newTask.due_date,
            userId: newTask.user_id,
            column: newTask.column || newTask.status
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Only include updateable fields
      const updateFields = {
        Id: parseInt(id)
      };

      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.xpValue !== undefined) updateFields.xp_value = parseInt(updateData.xpValue);
      if (updateData.xp_value !== undefined) updateFields.xp_value = parseInt(updateData.xp_value);
      if (updateData.status !== undefined) updateFields.status = updateData.status;
      if (updateData.priority !== undefined) updateFields.priority = updateData.priority;
      if (updateData.dueDate !== undefined) updateFields.due_date = updateData.dueDate;
      if (updateData.due_date !== undefined) updateFields.due_date = updateData.due_date;
      if (updateData.userId !== undefined) updateFields.user_id = updateData.userId;
      if (updateData.user_id !== undefined) updateFields.user_id = updateData.user_id;
      if (updateData.column !== undefined) updateFields.column = updateData.column;

      // Update Name field if title changed
      if (updateData.title !== undefined) updateFields.Name = updateData.title;

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
            title: updatedTask.title,
            description: updatedTask.description,
            xpValue: updatedTask.xp_value || 0,
            status: updatedTask.status || 'todo',
            priority: updatedTask.priority || 'medium',
            dueDate: updatedTask.due_date,
            userId: updatedTask.user_id,
            column: updatedTask.column || updatedTask.status
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
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
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  }
}

export const taskService = new TaskService();