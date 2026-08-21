import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';
import Dashboard from './pages/Dashboard';
import HotspotsPage from './pages/HotspotsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import RequestsPage from './pages/RequestsPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen" element={<CitizenPortal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hotspots" element={<HotspotsPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/requests" element={<RequestsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
