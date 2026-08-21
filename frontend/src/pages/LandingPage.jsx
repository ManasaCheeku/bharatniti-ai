import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Cpu, 
  BarChart3, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Layers,
  Zap,
  CheckCircle2,
  Share2,
  Lock,
  Code
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-8">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 text-xs font-semibold mb-6 shadow-md shadow-amber-500/5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>BRICS Innovation Challenge — Track 1 DPI & Governance</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-outfit max-w-4xl mx-auto leading-tight">
          From <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">Citizen Voices</span> to Evidence-Backed <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Development Priorities</span>
        </h1>

        <p className="mt-6 text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Multilingual AI-powered development intelligence for scalable Digital Public Infrastructure. <strong className="text-amber-400">Built for India. Designed for BRICS.</strong>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/citizen"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Submit a Development Request</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/90 text-slate-200 font-semibold text-sm border border-slate-700 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center space-x-2"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Explore Intelligence Dashboard</span>
          </Link>
        </div>

        {/* System Architecture Flow Diagram */}
        <div className="mt-16 p-6 rounded-2xl glass-card border border-slate-800 max-w-5xl mx-auto shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
            Multi-Channel End-to-End Intelligence Pipeline
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <MessageSquare className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-200">1. Citizen Voice</p>
              <p className="text-[10px] text-slate-400 mt-1">Web, Voice & Messaging (KN/HI/EN)</p>
            </div>

            <div className="hidden sm:block text-slate-600 text-center font-bold">➔</div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center relative">
              <Cpu className="w-6 h-6 text-emerald-400 mx-auto mb-2 animate-pulse" />
              <p className="font-bold text-xs text-slate-200">2. Gemini AI</p>
              <p className="text-[10px] text-slate-400 mt-1">Language Translation & Extraction</p>
            </div>

            <div className="hidden sm:block text-slate-600 text-center font-bold">➔</div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <MapPin className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-200">3. Hotspot Intelligence</p>
              <p className="text-[10px] text-slate-400 mt-1">Priority Scoring & Investment Gaps</p>
            </div>

          </div>
        </div>

      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 rounded-2xl glass-card border border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/80">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-outfit">The Core Problem</h3>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Governments across India and developing nations struggle to consolidate citizen feedback across fragmented systems, causing misaligned public spending, unaddressed infrastructure deficits, and an inability to measure digital public infrastructure impact.
          </p>
          <ul className="mt-6 space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center space-x-2">
              <span className="text-rose-400">✕</span>
              <span>Fragmented feedback across Web, Voice, and Messaging channels</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-rose-400">✕</span>
              <span>Language barriers in localized regional demands</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-rose-400">✕</span>
              <span>Disconnect between citizen demand and public investment plans</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl glass-card border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-900/80">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-outfit">The BharatNiti Solution</h3>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            BharatNiti AI bridges the gap between citizens and policy. By leveraging Google Gemini AI and cross-referencing baseline demographic & public investment indicators, it converts qualitative feedback into quantitative development priority scores (0–100) and actionable policy briefs.
          </p>
          <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <span className="text-emerald-400">✓</span>
              <span>Multi-channel intake (Web Text, Voice, Messaging App Prototype)</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-400">✓</span>
              <span>Transparent deterministic priority scoring formula</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-emerald-400">✓</span>
              <span>Public investment gap cross-analysis & AI Policy Briefs</span>
            </li>
          </ul>
        </div>

      </section>

      {/* DESIGNED FOR BRICS SCALE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="p-8 rounded-2xl glass-card border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
            <Globe className="w-4 h-4" />
            <span>BRICS Innovation Challenge Alignment</span>
          </div>

          <h2 className="text-2xl font-bold text-white font-outfit">Designed for BRICS-Scale Public Infrastructure</h2>
          <p className="text-xs text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
            BharatNiti AI is demonstrated using Indian citizen and infrastructure scenarios, while its country-independent data model is designed to support adaptation across BRICS nations.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <p className="font-bold text-sm text-emerald-400 font-outfit">🇮🇳 India</p>
              <p className="text-[10px] text-slate-400 mt-1">Live Demo Implementation</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center opacity-80">
              <p className="font-bold text-sm text-slate-200 font-outfit">🇧🇷 Brazil</p>
              <p className="text-[10px] text-slate-400 mt-1">Architecture Ready</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center opacity-80">
              <p className="font-bold text-sm text-slate-200 font-outfit">🇷🇺 Russia</p>
              <p className="text-[10px] text-slate-400 mt-1">Architecture Ready</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center opacity-80">
              <p className="font-bold text-sm text-slate-200 font-outfit">🇨🇳 China</p>
              <p className="text-[10px] text-slate-400 mt-1">Architecture Ready</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center opacity-80">
              <p className="font-bold text-sm text-slate-200 font-outfit">🇿🇦 South Africa</p>
              <p className="text-[10px] text-slate-400 mt-1">Architecture Ready</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 italic">*Note: Prototype dataset is synthetic and demonstrates BRICS data architecture readiness.</p>
        </div>
      </section>

      {/* DESIGNED AS A DIGITAL PUBLIC GOOD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white font-outfit">Designed According to Digital Public Good Principles</h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Built with open, interoperable architectural principles for national DPI deployment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
            <Code className="w-6 h-6 text-amber-400" />
            <h4 className="font-bold text-sm text-white font-outfit">Modular OpenAPI Architecture</h4>
            <p className="text-xs text-slate-400">Stateless RESTful APIs built on FastAPI with clear Pydantic data schemas.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
            <Share2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-sm text-white font-outfit">Multi-Channel Interoperability</h4>
            <p className="text-xs text-slate-400">Native support for Web, Voice Speech API, and Messaging gateway connectors.</p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h4 className="font-bold text-sm text-white font-outfit">Transparent Priority Scoring</h4>
            <p className="text-xs text-slate-400">Deterministic formula ensuring complete auditability and public accountability.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
