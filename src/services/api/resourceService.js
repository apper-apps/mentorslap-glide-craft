import { toast } from 'react-toastify';

class ResourceService {
  constructor() {
    this.tableName = 'resource';
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
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "read_time" } },
          { field: { Name: "featured" } }
        ],
        orderBy: [
          { fieldName: "featured", sorttype: "DESC" },
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

      return response.data.map(resource => ({
        Id: resource.Id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        author: resource.author,
        readTime: resource.read_time || 0,
        featured: resource.featured || false,
        tags: resource.tags || []
      }));
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to load resources");
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
          { field: { Name: "category" } },
          { field: { Name: "author" } },
          { field: { Name: "read_time" } },
          { field: { Name: "featured" } }
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

      const resource = response.data;
      return {
        Id: resource.Id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        author: resource.author,
        readTime: resource.read_time || 0,
        featured: resource.featured || false,
        tags: resource.tags || []
      };
    } catch (error) {
      console.error(`Error fetching resource with ID ${id}:`, error);
      toast.error("Failed to load resource");
      return null;
    }
  }

  async create(resourceData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: resourceData.title || 'New Resource',
          title: resourceData.title,
          description: resourceData.description || '',
          category: resourceData.category || 'productivity',
          author: resourceData.author || '',
          read_time: parseInt(resourceData.readTime) || parseInt(resourceData.read_time) || 0,
          featured: resourceData.featured || false
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
          const newResource = successfulRecords[0].data;
          toast.success('Resource created successfully!');
          return {
            Id: newResource.Id,
            title: newResource.title,
            description: newResource.description,
            category: newResource.category,
            author: newResource.author,
            readTime: newResource.read_time || 0,
            featured: newResource.featured || false,
            tags: newResource.tags || []
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to create resource");
      throw error;
    }
  }

  async update(id, resourceData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (resourceData.title !== undefined) {
        updateFields.title = resourceData.title;
        updateFields.Name = resourceData.title;
      }
      if (resourceData.description !== undefined) updateFields.description = resourceData.description;
      if (resourceData.category !== undefined) updateFields.category = resourceData.category;
      if (resourceData.author !== undefined) updateFields.author = resourceData.author;
      if (resourceData.readTime !== undefined) updateFields.read_time = parseInt(resourceData.readTime);
      if (resourceData.read_time !== undefined) updateFields.read_time = parseInt(resourceData.read_time);
      if (resourceData.featured !== undefined) updateFields.featured = resourceData.featured;

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
          const updatedResource = successfulUpdates[0].data;
          return {
            Id: updatedResource.Id,
            title: updatedResource.title,
            description: updatedResource.description,
            category: updatedResource.category,
            author: updatedResource.author,
            readTime: updatedResource.read_time || 0,
            featured: updatedResource.featured || false,
            tags: updatedResource.tags || []
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
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
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
      return false;
    }
  }
}

export const resourceService = new ResourceService();