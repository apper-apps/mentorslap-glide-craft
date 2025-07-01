import React from 'react';
import { motion } from 'framer-motion';
import BadgeCard from '@/components/molecules/BadgeCard';

const BadgeGrid = ({ badges, userProgress, earnedBadgeIds = [] }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg">No badges found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <BadgeCard 
            badge={badge} 
            userProgress={userProgress}
            isEarned={earnedBadgeIds.includes(badge.Id)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default BadgeGrid;