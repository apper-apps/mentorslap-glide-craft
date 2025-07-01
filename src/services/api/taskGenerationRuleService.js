import { toast } from 'react-toastify';

class TaskGenerationRuleService {
  constructor() {
    this.tableName = 'taskgenerationrule';
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
          { field: { Name: "description" } },
          { field: { Name: "criteria" } },
          { field: { Name: "tasktemplate" } },
          { field: { Name: "frequency" } }
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

      return response.data.map(rule => ({
        Id: rule.Id,
        name: rule.Name,
        description: rule.description,
        criteria: rule.criteria,
        taskTemplate: rule.tasktemplate,
        frequency: rule.frequency
      }));
    } catch (error) {
      console.error("Error fetching task generation rules:", error);
      toast.error("Failed to load generation rules");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "criteria" } },
          { field: { Name: "tasktemplate" } },
          { field: { Name: "frequency" } }
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

      const rule = response.data;
      return {
        Id: rule.Id,
        name: rule.Name,
        description: rule.description,
        criteria: rule.criteria,
        taskTemplate: rule.tasktemplate,
        frequency: rule.frequency
      };
    } catch (error) {
      console.error(`Error fetching generation rule with ID ${id}:`, error);
      toast.error("Failed to load generation rule");
      return null;
    }
  }

  async create(ruleData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: ruleData.name || 'New Generation Rule',
          description: ruleData.description || '',
          criteria: ruleData.criteria || '',
          tasktemplate: ruleData.taskTemplate || null,
          frequency: ruleData.frequency || 'daily'
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
          const newRule = successfulRecords[0].data;
          toast.success('Generation rule created successfully!');
          return {
            Id: newRule.Id,
            name: newRule.Name,
            description: newRule.description,
            criteria: newRule.criteria,
            taskTemplate: newRule.tasktemplate,
            frequency: newRule.frequency
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating generation rule:", error);
      toast.error("Failed to create generation rule");
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (updateData.name !== undefined) updateFields.Name = updateData.name;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.criteria !== undefined) updateFields.criteria = updateData.criteria;
      if (updateData.taskTemplate !== undefined) updateFields.tasktemplate = updateData.taskTemplate;
      if (updateData.frequency !== undefined) updateFields.frequency = updateData.frequency;

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
          const updatedRule = successfulUpdates[0].data;
          return {
            Id: updatedRule.Id,
            name: updatedRule.Name,
            description: updatedRule.description,
            criteria: updatedRule.criteria,
            taskTemplate: updatedRule.tasktemplate,
            frequency: updatedRule.frequency
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating generation rule:", error);
      toast.error("Failed to update generation rule");
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
      console.error("Error deleting generation rule:", error);
      toast.error("Failed to delete generation rule");
      return false;
    }
  }
}

export const taskGenerationRuleService = new TaskGenerationRuleService();