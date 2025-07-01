import React from 'react';
import Header from '@/components/organisms/Header';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturesSection from '@/components/organisms/FeaturesSection';
import PricingSection from '@/components/organisms/PricingSection';
import Footer from '@/components/organisms/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;