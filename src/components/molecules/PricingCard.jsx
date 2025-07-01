import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PricingCard = ({ plan, isPopular = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`relative bg-surface rounded-2xl p-8 border-2 transition-all duration-300 ${
        isPopular 
          ? 'border-primary-500 shadow-2xl shadow-primary-500/20' 
          : 'border-slate-700 hover:border-slate-600'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-100">{plan.name}</h3>
        <div className="space-y-1">
          <div className="text-4xl font-bold gradient-text">
            {plan.price === 0 ? 'Free' : `$${plan.price}`}
          </div>
          {plan.price > 0 && (
            <div className="text-slate-400">/month</div>
          )}
        </div>
        <p className="text-slate-400">{plan.description}</p>
      </div>
      
      <div className="space-y-4 mt-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <ApperIcon 
              name="Check" 
              size={16} 
              className="text-green-400 mt-0.5 flex-shrink-0" 
            />
            <span className="text-slate-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Button 
          variant={isPopular ? 'primary' : 'outline'} 
          size="lg" 
          className="w-full"
        >
          {plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingCard;