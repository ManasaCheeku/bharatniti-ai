import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  FileText, 
  Sparkles, 
  Activity, 
  Globe, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth()
      .then(data => setHealth(data))
      .catch(() => setHealth({ status: 'offline', ai_integration: 'Demo AI Mode' }));
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Globe },
    { path: '/citizen', label: 'Citizen Portal', icon: FileText },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/hotspots', label: 'Hotspots', icon: MapPin },
    { path: '/recommendations', label: 'AI Policy Briefs', icon: Sparkles },
    { path: '/requests', label: 'All Requests', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-slate-100 to-emerald-600 p-[2px] shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-white to-emerald-400 text-lg">
                  BN
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight font-outfit">
                  BharatNiti <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Track 1 DPI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multilingual Citizen-Development Intelligence
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI Engine Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-mono text-[11px]">
                {health?.ai_integration?.includes('Gemini') ? (
                  <span className="text-emerald-400 font-semibold">Gemini 2.5 Active</span>
                ) : (
                  <span className="text-amber-400">Demo AI Fallback</span>
                )}
              </span>
            </div>

            <Link
              to="/citizen"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold px-3.5 py-1.5 rounded-lg text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
