import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-accent-500/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-surface/50 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2"
          >
            <ApperIcon name="Sparkles" size={16} className="text-accent-500" />
            <span className="text-sm text-slate-300">AI-Powered Productivity for Entrepreneurs</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Get Unstuck.</span><br />
              <span className="gradient-text">Get Mentored.</span><br />
              <span className="text-white">Get Moving.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Transform your entrepreneurial paralysis into unstoppable momentum with AI-guided roadmaps, 
              gamified progress tracking, and daily motivation slaps.
            </p>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/onboarding">
              <Button variant="primary" size="xl" icon="Rocket">
                Start for Free
              </Button>
            </Link>
            <Link to="/app">
              <Button variant="outline" size="xl" icon="Brain">
                Try the AI
              </Button>
            </Link>
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8"
          >
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" size={16} />
                <span>1,000+ Entrepreneurs</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Target" size={16} />
                <span>10,000+ Goals Achieved</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Zap" size={16} />
                <span>500,000+ XP Earned</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;