import { toast } from 'react-toastify';

class BadgeService {
  constructor() {
    this.tableName = 'badge';
    this.apperClient = null;
    this.initializeClient();
    this.userBadges = []; // Temporary storage for user badges
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
          { field: { Name: "icon" } },
          { field: { Name: "rarity" } },
          { field: { Name: "requirement" } },
          { field: { Name: "category" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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

      return response.data.map(badge => ({
        Id: badge.Id,
        name: badge.Name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        requirement: badge.requirement,
        category: badge.category
      }));
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to load badges");
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
          { field: { Name: "icon" } },
          { field: { Name: "rarity" } },
          { field: { Name: "requirement" } },
          { field: { Name: "category" } }
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

      const badge = response.data;
      return {
        Id: badge.Id,
        name: badge.Name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        requirement: badge.requirement,
        category: badge.category
      };
    } catch (error) {
      console.error(`Error fetching badge with ID ${id}:`, error);
      toast.error("Failed to load badge");
      return null;
    }
  }

  async getUserBadges() {
    // For now, return local user badges
    // In a real implementation, this would query a user_badges table
    return [...this.userBadges];
  }

  async awardBadge(badgeId) {
    // Check if badge already awarded
    if (!this.userBadges.find(b => b.badgeId === badgeId)) {
      const badge = await this.getById(badgeId);
      if (badge) {
        this.userBadges.push({
          Id: this.userBadges.length + 1,
          badgeId,
          earnedAt: new Date().toISOString(),
          badge
        });
        return { ...badge };
      }
    }
    return null;
  }

  async checkMilestones(tasks) {
    const completedTasks = tasks.filter(task => task.status === 'done');
    const totalXP = completedTasks.reduce((sum, task) => sum + (task.xpValue || task.xp_value || 0), 0);
    
    const newBadges = [];
    
    // Check consecutive task completion (3 in a row)
    const consecutiveTasks = this.checkConsecutiveCompletion(tasks);
    if (consecutiveTasks >= 3 && !this.userBadges.find(b => b.badgeId === 4)) {
      const badge = await this.awardBadge(4);
      if (badge) newBadges.push(badge);
    }

    // Check task completion milestones
    const milestones = [
      { count: 1, badgeId: 1 },
      { count: 5, badgeId: 2 },
      { count: 10, badgeId: 5 },
      { count: 20, badgeId: 3 }
    ];
    
    for (const milestone of milestones) {
      if (completedTasks.length >= milestone.count && 
          !this.userBadges.find(b => b.badgeId === milestone.badgeId)) {
        const badge = await this.awardBadge(milestone.badgeId);
        if (badge) newBadges.push(badge);
      }
    }

    // Check XP milestones
    const xpMilestones = [
      { xp: 500, badgeId: 6 },
      { xp: 1000, badgeId: 7 }
    ];
    
    for (const milestone of xpMilestones) {
      if (totalXP >= milestone.xp && 
          !this.userBadges.find(b => b.badgeId === milestone.badgeId)) {
        const badge = await this.awardBadge(milestone.badgeId);
        if (badge) newBadges.push(badge);
      }
    }

    return newBadges;
  }

  checkConsecutiveCompletion(tasks) {
    const sortedTasks = tasks
      .filter(task => task.status === 'done')
      .sort((a, b) => new Date(b.completedAt || b.createdAt || Date.now()) - new Date(a.completedAt || a.createdAt || Date.now()));
    
    let consecutive = 0;
    for (let i = 0; i < sortedTasks.length; i++) {
      consecutive++;
      if (i < sortedTasks.length - 1) {
        const current = new Date(sortedTasks[i].completedAt || sortedTasks[i].createdAt || Date.now());
        const next = new Date(sortedTasks[i + 1].completedAt || sortedTasks[i + 1].createdAt || Date.now());
        const daysDiff = Math.abs(current - next) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 1) break;
      }
    }
    
    return consecutive;
  }

  async create(badgeData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: badgeData.name || badgeData.Name || 'New Badge',
          description: badgeData.description || '',
          icon: badgeData.icon || 'Award',
          rarity: badgeData.rarity || 'common',
          requirement: badgeData.requirement || '',
          category: badgeData.category || 'milestone'
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
          const newBadge = successfulRecords[0].data;
          return {
            Id: newBadge.Id,
            name: newBadge.Name,
            description: newBadge.description,
            icon: newBadge.icon,
            rarity: newBadge.rarity,
            requirement: newBadge.requirement,
            category: newBadge.category
          };
        }
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating badge:", error);
      toast.error("Failed to create badge");
      throw error;
    }
  }

  async update(id, badgeData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (badgeData.name !== undefined) {
        updateFields.Name = badgeData.name;
      }
      if (badgeData.description !== undefined) updateFields.description = badgeData.description;
      if (badgeData.icon !== undefined) updateFields.icon = badgeData.icon;
      if (badgeData.rarity !== undefined) updateFields.rarity = badgeData.rarity;
      if (badgeData.requirement !== undefined) updateFields.requirement = badgeData.requirement;
      if (badgeData.category !== undefined) updateFields.category = badgeData.category;

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
          const updatedBadge = successfulUpdates[0].data;
          return {
            Id: updatedBadge.Id,
            name: updatedBadge.Name,
            description: updatedBadge.description,
            icon: updatedBadge.icon,
            rarity: updatedBadge.rarity,
            requirement: updatedBadge.requirement,
            category: updatedBadge.category
          };
        }
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating badge:", error);
      toast.error("Failed to update badge");
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
      console.error("Error deleting badge:", error);
      toast.error("Failed to delete badge");
      return false;
    }
  }
}

export const badgeService = new BadgeService();