import React from 'react';
import Header from '@/components/organisms/Header';
import PricingSection from '@/components/organisms/PricingSection';
import Footer from '@/components/organisms/Footer';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-20">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;