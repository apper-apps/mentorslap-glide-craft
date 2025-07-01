import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProgressPage from "@/components/pages/ProgressPage";
import TasksPage from "@/components/pages/TasksPage";
import DashboardPage from "@/components/pages/DashboardPage";
import PricingPage from "@/components/pages/PricingPage";
import OnboardingPage from "@/components/pages/OnboardingPage";
import LandingPage from "@/components/pages/LandingPage";
import ResourcesPage from "@/components/pages/ResourcesPage";
import ProjectsPage from "@/components/pages/ProjectsPage";
import Layout from "@/components/organisms/Layout";

function App() {
return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-slate-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
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
    </BrowserRouter>
  );
}

export default App;