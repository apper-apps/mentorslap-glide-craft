import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    projectIdea: '',
    goal: '',
    timeline: '',
    industry: ''
  });
  
  const totalSteps = 4;
  
  const goals = [
    { id: 'launch', label: 'Launch a Product', description: 'Build and ship your first product' },
    { id: 'clients', label: 'Get Clients', description: 'Find and convert your first customers' },
    { id: 'traffic', label: 'Grow Traffic', description: 'Build an audience and drive visitors' },
    { id: 'revenue', label: 'Generate Revenue', description: 'Create sustainable income streams' }
  ];
  
  const timelines = [
    { id: '1month', label: '1 Month', description: 'Quick wins and momentum' },
    { id: '3months', label: '3 Months', description: 'Steady progress with milestones' },
    { id: '6months', label: '6 Months', description: 'Comprehensive transformation' },
    { id: '1year', label: '1 Year', description: 'Long-term vision execution' }
  ];
  
  const industries = [
    'SaaS & Tech', 'E-commerce', 'Content Creation', 'Consulting',
    'Design & Creative', 'Marketing Agency', 'Education', 'Health & Fitness'
  ];
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRoadmap();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const generateRoadmap = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('🎉 Your personalized roadmap is ready!');
    navigate('/app');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">What's your project idea?</h2>
              <p className="text-slate-400">Tell us about the project you want to build or grow</p>
            </div>
            <Input
              label="Project Description"
              placeholder="e.g., A mobile app for local food delivery, a course on digital marketing..."
              value={formData.projectIdea}
              onChange={(e) => handleInputChange('projectIdea', e.target.value)}
              icon="Lightbulb"
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">What's your main goal?</h2>
              <p className="text-slate-400">Choose the outcome you're most focused on achieving</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    formData.goal === goal.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'hover:border-slate-600'
                  }`}
                  onClick={() => handleInputChange('goal', goal.id)}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-100">{goal.label}</h3>
                    <p className="text-sm text-slate-400">{goal.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">What's your timeline?</h2>
              <p className="text-slate-400">How quickly do you want to achieve your goal?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timelines.map((timeline) => (
                <Card
                  key={timeline.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    formData.timeline === timeline.id
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'hover:border-slate-600'
                  }`}
                  onClick={() => handleInputChange('timeline', timeline.id)}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-slate-100">{timeline.label}</h3>
                    <p className="text-sm text-slate-400">{timeline.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-100">What industry are you in?</h2>
              <p className="text-slate-400">This helps us personalize your roadmap</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {industries.map((industry) => (
                <Card
                  key={industry}
                  className={`p-3 cursor-pointer text-center transition-all duration-200 ${
                    formData.industry === industry
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'hover:border-slate-600'
                  }`}
                  onClick={() => handleInputChange('industry', industry)}
                >
                  <span className="text-sm font-medium text-slate-100">{industry}</span>
                </Card>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Brain" size={40} className="text-white animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold gradient-text">AI is crafting your roadmap...</h2>
            <p className="text-slate-400">Analyzing your goals and creating personalized tasks</p>
          </div>
          <div className="w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Let's get you unstuck!</h1>
          <p className="text-slate-400">Tell us about your project so we can create your personalized roadmap</p>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        
        {/* Step Content */}
        <Card className="p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            icon="ArrowLeft"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !formData.projectIdea) ||
              (currentStep === 2 && !formData.goal) ||
              (currentStep === 3 && !formData.timeline) ||
              (currentStep === 4 && !formData.industry)
            }
            icon={currentStep === totalSteps ? "Sparkles" : "ArrowRight"}
          >
            {currentStep === totalSteps ? 'Generate Roadmap' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;