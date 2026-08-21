import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { STATES_AND_DISTRICTS, CATEGORIES } from '../data/presets';
import { generatePolicyBrief } from '../services/api';

export default function RecommendationsPage() {
  const [searchParams] = useSearchParams();
  
  const [state, setState] = useState(searchParams.get('state') || 'Karnataka');
  const [district, setDistrict] = useState(searchParams.get('district') || 'Mysuru');
  const [category, setCategory] = useState(searchParams.get('category') || 'Healthcare');

  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState('');

  // Auto-generate on initial page load if URL params present
  useEffect(() => {
    if (searchParams.get('state') && searchParams.get('district') && searchParams.get('category')) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setBrief(null);

    try {
      const data = await generatePolicyBrief({ state, district, category });
      setBrief(data);
    } catch (err) {
      setError(err.message || 'Failed to generate policy recommendation brief.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini AI Policy Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-outfit">AI Policy Recommendation Studio</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Synthesize localized citizen demand and district metrics into structured government decision-support briefs.
        </p>
      </div>

      {/* SELECTION FORM */}
      <form onSubmit={handleGenerate} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
            <select
              value={state}
              onChange={(e) => {
                const st = e.target.value;
                setState(st);
                setDistrict(STATES_AND_DISTRICTS[st]?.[0] || '');
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {Object.keys(STATES_AND_DISTRICTS).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">District</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {(STATES_AND_DISTRICTS[state] || []).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Generating AI Policy Brief...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Policy Brief</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* POLICY BRIEF DISPLAY */}
      {brief && (
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/30 bg-slate-900/90 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Official AI Decision-Support Document
              </span>
              <h2 className="text-xl font-bold text-white font-outfit">
                Development Policy Brief — {brief.category}
              </h2>
              <p className="text-xs text-slate-400">Target Region: {brief.district}, {brief.state}</p>
            </div>
            
            <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700">
              {brief.ai_mode}
            </div>
          </div>

          {/* Section 1: Problem Summary & Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400 font-outfit text-sm">1. Problem Summary</h4>
              <p className="text-slate-300 leading-relaxed">{brief.problem_summary}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 font-outfit text-sm">2. Evidence Base</h4>
              <p className="text-slate-300 leading-relaxed">{brief.evidence}</p>
            </div>
          </div>

          {/* Section 2: Infrastructure Gap & Affected Population */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-blue-400 font-outfit text-sm">3. Infrastructure Gap & Impact Assessment</h4>
            <p className="text-slate-300">{brief.infrastructure_gap_analysis}</p>
            <p className="text-slate-400 font-semibold pt-1">
              Estimated Affected Population: <span className="text-white font-bold">{brief.affected_population_estimate?.toLocaleString()} citizens</span>
            </p>
          </div>

          {/* Section 3: Recommended Intervention */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-400 font-outfit text-sm">4. Recommended Policy Intervention</h4>
            <p className="text-slate-200 font-medium text-sm leading-relaxed">{brief.recommended_intervention}</p>
          </div>

          {/* Section 4: Implementation Roadmap */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 font-outfit text-sm">5. Implementation Roadmap</h4>
            <div className="space-y-2">
              {brief.implementation_roadmap?.map((step, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Risk Mitigation & Success Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-rose-400 font-outfit text-sm">Risk Mitigation</h4>
              <p className="text-slate-300">{brief.risk_mitigation}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-purple-400 font-outfit text-sm">Success Indicators</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {brief.success_indicators?.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{brief.disclaimer}</span>
          </div>

        </div>
      )}

    </div>
  );
}
