import mockBadges from '@/services/mockData/badges.json';

class BadgeService {
  constructor() {
    this.badges = [...mockBadges];
    this.userBadges = []; // Badges earned by user
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.badges];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const badge = this.badges.find(b => b.Id === parseInt(id));
    if (!badge) {
      throw new Error('Badge not found');
    }
    return { ...badge };
  }

  async getUserBadges() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.userBadges];
  }

  async awardBadge(badgeId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    if (!this.userBadges.find(b => b.badgeId === badgeId)) {
      const badge = this.badges.find(b => b.Id === badgeId);
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
    const totalXP = completedTasks.reduce((sum, task) => sum + task.xpValue, 0);
    const currentLevel = Math.floor(totalXP / 200) + 1;
    
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
      .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
    
    let consecutive = 0;
    for (let i = 0; i < sortedTasks.length; i++) {
      consecutive++;
      if (i < sortedTasks.length - 1) {
        const current = new Date(sortedTasks[i].completedAt || sortedTasks[i].createdAt);
        const next = new Date(sortedTasks[i + 1].completedAt || sortedTasks[i + 1].createdAt);
        const daysDiff = Math.abs(current - next) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 1) break;
      }
    }
    
    return consecutive;
  }

  async create(badgeData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.badges.map(b => b.Id), 0) + 1;
    const newBadge = {
      Id: newId,
      ...badgeData,
      createdAt: new Date().toISOString()
    };
    this.badges.push(newBadge);
    return { ...newBadge };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.badges.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Badge not found');
    }
    this.badges[index] = { ...this.badges[index], ...updateData };
    return { ...this.badges[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.badges.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Badge not found');
    }
    this.badges.splice(index, 1);
    return true;
  }
}

export const badgeService = new BadgeService();