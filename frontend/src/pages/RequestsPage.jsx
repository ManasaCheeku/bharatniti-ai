import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Sparkles, 
  Globe2, 
  MapPin, 
  Layers, 
  Calendar,
  X,
  Smartphone
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';
import { fetchAllRequests } from '../services/api';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  const [selectedRequestModal, setSelectedRequestModal] = useState(null);

  useEffect(() => {
    fetchAllRequests()
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = requests.filter(r => {
    if (searchTerm && !r.original_text.toLowerCase().includes(searchTerm.toLowerCase()) && !r.district.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory && r.category !== selectedCategory) return false;
    if (selectedLang && r.detected_language !== selectedLang) return false;
    if (selectedSource && r.source !== selectedSource) return false;
    return true;
  });

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Public Citizen Intake Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">All Citizen Development Requests</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect structured Gemini AI extractions across Web, Voice, and Messaging Channels.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search grievance or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Categories</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Roads">Roads</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Education">Education</option>
            <option value="Electricity">Electricity</option>
            <option value="Public Transport">Public Transport</option>
            <option value="Digital Infrastructure">Digital Infrastructure</option>
          </select>
        </div>

        <div>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Channels</option>
            <option value="Web">Web Text</option>
            <option value="Voice">Voice Input</option>
            <option value="Messaging App">Messaging App</option>
            <option value="Demo Dataset">Demo Dataset</option>
          </select>
        </div>

      </div>

      {/* CARDS LIST */}
      {loading ? (
        <p className="text-xs text-slate-400">Loading citizen requests...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-slate-400">No requests found matching your filter criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequestModal(req)}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white font-outfit">{req.district}, {req.state}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      {req.detected_language}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                      {req.source || 'Web'}
                    </span>
                  </div>
                  <PriorityBadge score={req.priority_score} />
                </div>

                <p className="text-xs font-semibold text-amber-400 mt-2">{req.category}</p>

                <p className="text-xs text-slate-300 mt-1 line-clamp-3 leading-relaxed">
                  "{req.original_text}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(req.created_at).toLocaleDateString()}</span>
                </span>

                <span className="text-amber-400 font-semibold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View AI Breakdown</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED MODAL */}
      {selectedRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full p-6 rounded-2xl glass-card border border-slate-700 bg-slate-900 space-y-4 max-h-[90vh] overflow-y-auto relative">
            
            <button
              onClick={() => setSelectedRequestModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-lg text-white font-outfit">Detailed Gemini AI Analysis</h3>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
              <div>
                <p className="font-bold text-slate-200">{selectedRequestModal.district}, {selectedRequestModal.state} ({selectedRequestModal.country || 'India'})</p>
                <p className="text-amber-400 font-semibold">{selectedRequestModal.category} | Channel: {selectedRequestModal.source || 'Web'}</p>
              </div>
              <PriorityBadge score={selectedRequestModal.priority_score} />
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Original Text ({selectedRequestModal.detected_language})</span>
              <p className="p-3 bg-slate-950 rounded-xl text-slate-200 italic font-mono">"{selectedRequestModal.original_text}"</p>
            </div>

            {selectedRequestModal.translated_text && (
              <div className="space-y-2 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">English Representation</span>
                <p className="p-3 bg-slate-950 rounded-xl text-slate-300">"{selectedRequestModal.translated_text}"</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400">Urgency</span>
                <p className="font-bold text-rose-400">{selectedRequestModal.urgency}/100</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400">Infra Gap</span>
                <p className="font-bold text-amber-400">{selectedRequestModal.infrastructure_gap}/100</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400">Priority Score</span>
                <p className="font-bold text-emerald-400">{selectedRequestModal.priority_score}/100</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl">
                <span className="text-[10px] text-slate-400">Affected Pop</span>
                <p className="font-bold text-blue-400">{selectedRequestModal.affected_population_estimate?.toLocaleString()}</p>
              </div>
            </div>

            {selectedRequestModal.issue_summary && (
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Core Issue Summary</span>
                <p className="text-slate-200">{selectedRequestModal.issue_summary}</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
