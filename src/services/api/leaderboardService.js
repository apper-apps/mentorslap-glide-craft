import CryptoJS from 'crypto-js';
import mockLeaderboard from '@/services/mockData/leaderboard.json';

class LeaderboardService {
  constructor() {
    this.leaderboard = [...mockLeaderboard];
    this.encryptionKey = 'mentorslap-secret-key';
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.leaderboard
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        anonymousName: this.generateAnonymousName(entry.userId)
      }));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entry = this.leaderboard.find(e => e.Id === parseInt(id));
    if (!entry) {
      throw new Error('Leaderboard entry not found');
    }
    return { 
      ...entry,
      anonymousName: this.generateAnonymousName(entry.userId)
    };
  }

  async getUserRank(userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const sorted = this.leaderboard.sort((a, b) => b.score - a.score);
    const userIndex = sorted.findIndex(entry => entry.userId === userId);
    return userIndex !== -1 ? userIndex + 1 : null;
  }

  async updateUserScore(userId, scoreData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.leaderboard.findIndex(e => e.userId === userId);
    
    if (index === -1) {
      // Create new entry
      const newEntry = {
        Id: this.leaderboard.length + 1,
        userId,
        score: scoreData.totalXP || 0,
        badgeCount: scoreData.badgeCount || 0,
        tasksCompleted: scoreData.tasksCompleted || 0,
        streak: scoreData.streak || 0,
        level: scoreData.level || 1,
        lastActive: new Date().toISOString()
      };
      this.leaderboard.push(newEntry);
      return { ...newEntry };
    } else {
      // Update existing entry
      this.leaderboard[index] = {
        ...this.leaderboard[index],
        ...scoreData,
        lastActive: new Date().toISOString()
      };
      return { ...this.leaderboard[index] };
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
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        anonymousName: this.generateAnonymousName(entry.userId)
      }));
  }

  async create(entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.leaderboard.map(e => e.Id), 0) + 1;
    const newEntry = {
      Id: newId,
      ...entryData,
      createdAt: new Date().toISOString()
    };
    this.leaderboard.push(newEntry);
    return { ...newEntry };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.leaderboard.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Leaderboard entry not found');
    }
    this.leaderboard[index] = { ...this.leaderboard[index], ...updateData };
    return { ...this.leaderboard[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.leaderboard.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Leaderboard entry not found');
    }
    this.leaderboard.splice(index, 1);
    return true;
  }
}

export const leaderboardService = new LeaderboardService();