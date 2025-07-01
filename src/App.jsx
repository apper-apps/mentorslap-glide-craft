import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import LandingPage from '@/components/pages/LandingPage';
import OnboardingPage from '@/components/pages/OnboardingPage';
import DashboardPage from '@/components/pages/DashboardPage';
import TasksPage from '@/components/pages/TasksPage';
import ProgressPage from '@/components/pages/ProgressPage';
import ResourcesPage from '@/components/pages/ResourcesPage';
import PricingPage from '@/components/pages/PricingPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-slate-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="resources" element={<ResourcesPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;