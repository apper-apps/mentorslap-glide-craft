import React from "react";
import { motion } from "framer-motion";
import PricingCard from "@/components/molecules/PricingCard";

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        '1 AI-generated roadmap',
        'Basic task management',
        'XP tracking & levels',
        'Daily motivation slaps',
        'Community access'
      ]
    },
    {
      name: 'Pro',
      price: 19,
      description: 'For serious entrepreneurs',
      features: [
        'Unlimited AI roadmaps',
        'Advanced task automation',
        'Priority support',
        'Custom achievement badges',
        'Progress analytics',
        'Export capabilities',
        'Calendar integrations'
      ]
    },
    {
      name: 'Premium',
      price: 49,
      description: 'For scaling businesses',
      features: [
        'Everything in Pro',
        'Personal AI mentor chat',
        'Custom branding',
        'Team collaboration',
        'Advanced reporting',
        'API access',
        '1-on-1 strategy calls'
      ]
    }
  ];
  
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold">
            Choose your{' '}
            <span className="gradient-text">momentum plan</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Start free and upgrade as you build momentum. All plans include our core features 
            to help you get unstuck and stay moving.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isPopular={index === 1}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
<p className="text-slate-400 text-sm">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;