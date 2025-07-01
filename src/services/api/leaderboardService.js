import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';

class LeaderboardService {
  constructor() {
    this.tableName = 'leaderboard';
    this.apperClient = null;
    this.encryptionKey = 'mentorslap-secret-key';
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
          { field: { Name: "score" } },
          { field: { Name: "badge_count" } },
          { field: { Name: "tasks_completed" } },
          { field: { Name: "streak" } },
          { field: { Name: "level" } },
          { field: { Name: "last_active" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [
          { fieldName: "score", sorttype: "DESC" }
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

      return response.data.map((entry, index) => ({
        Id: entry.Id,
        userId: entry.user_id,
        score: entry.score || 0,
        badgeCount: entry.badge_count || 0,
        tasksCompleted: entry.tasks_completed || 0,
        streak: entry.streak || 0,
        level: entry.level || 1,
        lastActive: entry.last_active,
        rank: index + 1,
        anonymousName: this.generateAnonymousName(entry.user_id)
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "score" } },
          { field: { Name: "badge_count" } },
          { field: { Name: "tasks_completed" } },
          { field: { Name: "streak" } },
          { field: { Name: "level" } },
          { field: { Name: "last_active" } },
          { field: { Name: "user_id" } }
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
        userId: entry.user_id,
        score: entry.score || 0,
        badgeCount: entry.badge_count || 0,
        tasksCompleted: entry.tasks_completed || 0,
        streak: entry.streak || 0,
        level: entry.level || 1,
        lastActive: entry.last_active,
        anonymousName: this.generateAnonymousName(entry.user_id)
      };
    } catch (error) {
      console.error(`Error fetching leaderboard entry with ID ${id}:`, error);
      toast.error("Failed to load leaderboard entry");
      return null;
    }
  }

  async getUserRank(userId) {
    try {
      const leaderboard = await this.getAll();
      const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
      return userIndex !== -1 ? userIndex + 1 : null;
    } catch (error) {
      console.error("Error getting user rank:", error);
      return null;
    }
  }

  async updateUserScore(userId, scoreData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // First, try to find existing entry for this user
      const existingParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [userId]
          }
        ]
      };

      const existingResponse = await this.apperClient.fetchRecords(this.tableName, existingParams);
      
      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing entry
        const existingEntry = existingResponse.data[0];
        const updateFields = {
          Id: existingEntry.Id,
          score: scoreData.totalXP || scoreData.score || 0,
          badge_count: scoreData.badgeCount || scoreData.badge_count || 0,
          tasks_completed: scoreData.tasksCompleted || scoreData.tasks_completed || 0,
          streak: scoreData.streak || 0,
          level: scoreData.level || 1,
          last_active: new Date().toISOString()
        };

        const updateParams = {
          records: [updateFields]
        };

        const updateResponse = await this.apperClient.updateRecord(this.tableName, updateParams);
        
        if (!updateResponse.success) {
          console.error(updateResponse.message);
          toast.error(updateResponse.message);
          throw new Error(updateResponse.message);
        }

        if (updateResponse.results && updateResponse.results[0] && updateResponse.results[0].success) {
          const updatedEntry = updateResponse.results[0].data;
          return {
            Id: updatedEntry.Id,
            userId: updatedEntry.user_id,
            score: updatedEntry.score || 0,
            badgeCount: updatedEntry.badge_count || 0,
            tasksCompleted: updatedEntry.tasks_completed || 0,
            streak: updatedEntry.streak || 0,
            level: updatedEntry.level || 1,
            lastActive: updatedEntry.last_active
          };
        }
      } else {
        // Create new entry
        const createParams = {
          records: [{
            Name: `User ${userId} Leaderboard Entry`,
            user_id: userId,
            score: scoreData.totalXP || scoreData.score || 0,
            badge_count: scoreData.badgeCount || scoreData.badge_count || 0,
            tasks_completed: scoreData.tasksCompleted || scoreData.tasks_completed || 0,
            streak: scoreData.streak || 0,
            level: scoreData.level || 1,
            last_active: new Date().toISOString()
          }]
        };

        const createResponse = await this.apperClient.createRecord(this.tableName, createParams);
        
        if (!createResponse.success) {
          console.error(createResponse.message);
          toast.error(createResponse.message);
          throw new Error(createResponse.message);
        }

        if (createResponse.results && createResponse.results[0] && createResponse.results[0].success) {
          const newEntry = createResponse.results[0].data;
          return {
            Id: newEntry.Id,
            userId: newEntry.user_id,
            score: newEntry.score || 0,
            badgeCount: newEntry.badge_count || 0,
            tasksCompleted: newEntry.tasks_completed || 0,
            streak: newEntry.streak || 0,
            level: newEntry.level || 1,
            lastActive: newEntry.last_active
          };
        }
      }

      throw new Error('Failed to update user score');
    } catch (error) {
      console.error("Error updating user score:", error);
      toast.error("Failed to update user score");
      throw error;
    }
  }

  generateAnonymousName(userId) {
    const encrypted = CryptoJS.AES.encrypt(userId.toString(), this.encryptionKey).toString();
    const hash = CryptoJS.MD5(encrypted).toString();
    
    const adjectives = [
      'Swift', 'Clever', 'Bold', 'Sharp', 'Bright', 'Quick', 'Smart', 'Wise',
      'Keen', 'Alert', 'Agile', 'Fast', 'Rapid', 'Nimble', 'Witty', 'Savvy'
    ];
    
    const nouns = [
      'Builder', 'Creator', 'Maker', 'Innovator', 'Pioneer', 'Achiever', 'Champion',
      'Master', 'Expert', 'Guru', 'Ninja', 'Wizard', 'Hero', 'Legend', 'Star', 'Ace'
    ];
    
    const adjIndex = parseInt(hash.substr(0, 2), 16) % adjectives.length;
    const nounIndex = parseInt(hash.substr(2, 2), 16) % nouns.length;
    const number = parseInt(hash.substr(4, 3), 16) % 1000;
    
    return `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
  }

  async getTopPerformers(limit = 10) {
    try {
      const leaderboard = await this.getAll();
      return leaderboard.slice(0, limit);
    } catch (error) {
      console.error("Error getting top performers:", error);
      return [];
    }
  }

  async create(entryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: entryData.name || entryData.Name || `User ${entryData.userId || entryData.user_id} Entry`,
          user_id: entryData.userId || entryData.user_id,
          score: entryData.score || 0,
          badge_count: entryData.badgeCount || entryData.badge_count || 0,
          tasks_completed: entryData.tasksCompleted || entryData.tasks_completed || 0,
          streak: entryData.streak || 0,
          level: entryData.level || 1,
          last_active: entryData.lastActive || entryData.last_active || new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const newEntry = response.results[0].data;
        return {
          Id: newEntry.Id,
          userId: newEntry.user_id,
          score: newEntry.score || 0,
          badgeCount: newEntry.badge_count || 0,
          tasksCompleted: newEntry.tasks_completed || 0,
          streak: newEntry.streak || 0,
          level: newEntry.level || 1,
          lastActive: newEntry.last_active
        };
      }

      throw new Error('No successful records created');
    } catch (error) {
      console.error("Error creating leaderboard entry:", error);
      toast.error("Failed to create leaderboard entry");
      throw error;
    }
  }

  async update(id, entryData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateFields = {
        Id: parseInt(id)
      };

      if (entryData.userId !== undefined) updateFields.user_id = entryData.userId;
      if (entryData.user_id !== undefined) updateFields.user_id = entryData.user_id;
      if (entryData.score !== undefined) updateFields.score = entryData.score;
      if (entryData.badgeCount !== undefined) updateFields.badge_count = entryData.badgeCount;
      if (entryData.badge_count !== undefined) updateFields.badge_count = entryData.badge_count;
      if (entryData.tasksCompleted !== undefined) updateFields.tasks_completed = entryData.tasksCompleted;
      if (entryData.tasks_completed !== undefined) updateFields.tasks_completed = entryData.tasks_completed;
      if (entryData.streak !== undefined) updateFields.streak = entryData.streak;
      if (entryData.level !== undefined) updateFields.level = entryData.level;
      if (entryData.lastActive !== undefined) updateFields.last_active = entryData.lastActive;
      if (entryData.last_active !== undefined) updateFields.last_active = entryData.last_active;

      const params = {
        records: [updateFields]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const updatedEntry = response.results[0].data;
        return {
          Id: updatedEntry.Id,
          userId: updatedEntry.user_id,
          score: updatedEntry.score || 0,
          badgeCount: updatedEntry.badge_count || 0,
          tasksCompleted: updatedEntry.tasks_completed || 0,
          streak: updatedEntry.streak || 0,
          level: updatedEntry.level || 1,
          lastActive: updatedEntry.last_active
        };
      }

      throw new Error('No successful updates completed');
    } catch (error) {
      console.error("Error updating leaderboard entry:", error);
      toast.error("Failed to update leaderboard entry");
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
      console.error("Error deleting leaderboard entry:", error);
      toast.error("Failed to delete leaderboard entry");
      return false;
    }
  }
}

export const leaderboardService = new LeaderboardService();