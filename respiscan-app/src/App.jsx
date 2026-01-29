import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Activity, Mic, Home, FileText, User } from 'lucide-react';

// Placeholders for pages
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Recording = React.lazy(() => import('./pages/Recording'));
const Analysis = React.lazy(() => import('./pages/Analysis'));
const Result = React.lazy(() => import('./pages/Result'));
const BreathingScan = React.lazy(() => import('./pages/BreathingScan'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div className="flex h-screen items-center justify-center text-hospital-blue-600">Loading RespiScan...</div>}>
        <div className="font-sans text-hospital-blue-900 antialiased selection:bg-medical-teal-500 selection:text-white">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/record" element={<Recording />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/result" element={<Result />} />
            <Route path="/breathing-scan" element={<BreathingScan />} />
          </Routes>
        </div>
      </React.Suspense>
    </Router>
  );
}

export default App;
