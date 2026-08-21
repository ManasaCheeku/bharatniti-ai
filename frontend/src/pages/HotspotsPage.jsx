import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, Filter, Layers, Users, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import HotspotMap from '../components/HotspotMap';
import PriorityBadge from '../components/PriorityBadge';
import { fetchHotspots } from '../services/api';
import { STATES_AND_DISTRICTS } from '../data/presets';

export default function HotspotsPage() {
  const navigate = useNavigate();
  const [hotspots, setHotspots] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHotspots(selectedState)
      .then(data => {
        setHotspots(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedState]);

  const handleSelectHotspot = (item) => {
    navigate(`/recommendations?state=${encodeURIComponent(item.state)}&district=${encodeURIComponent(item.district)}&category=${encodeURIComponent(item.category)}`);
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geographic Hotspot Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">India Development Hotspots</h1>
          <p className="text-xs text-slate-400 mt-1">
            Identifying high-urgency infrastructure deficit clusters aggregated by State, District, Category, and Investment Gap.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-amber-400" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Indian States</option>
            {Object.keys(STATES_AND_DISTRICTS).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAP VIEW */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 font-outfit flex items-center space-x-2">
          <span>Interactive Regional Hotspot Map Layer</span>
          <span className="text-xs text-slate-400 font-normal">(Leaflet / OpenStreetMap Integration)</span>
        </h3>
        <HotspotMap hotspots={hotspots} onSelectHotspot={handleSelectHotspot} />
      </div>

      {/* HOTSPOTS CARDS GRID */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white font-outfit">High-Priority Hotspot Directory</h3>

        {loading ? (
          <p className="text-xs text-slate-400">Loading hotspot metrics...</p>
        ) : hotspots.length === 0 ? (
          <p className="text-xs text-slate-400">No hotspots found matching criteria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotspots.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white font-outfit">{item.district}</h4>
                      <p className="text-xs text-slate-400">{item.state}</p>
                    </div>
                    <PriorityBadge score={item.average_priority} />
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Category Hotspot</span>
                      <p className="font-bold text-amber-400 text-sm mt-0.5">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Dev Gap Score</span>
                      <p className="font-bold text-rose-400 text-sm mt-0.5">{item.development_gap_score || 82.5}/100</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mt-3 text-center">
                    <div className="p-2 bg-slate-900/60 rounded-lg">
                      <span className="text-[9px] text-slate-400">Demand</span>
                      <p className="font-bold text-slate-200">{item.request_count} reqs</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg">
                      <span className="text-[9px] text-slate-400">Infra Gap</span>
                      <p className="font-bold text-amber-400">{item.infrastructure_gap}%</p>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-lg">
                      <span className="text-[9px] text-slate-400">Invest Deficit</span>
                      <p className="font-bold text-purple-400">{item.investment_gap_percent || 65}%</p>
                    </div>
                  </div>

                  {/* Why this is a hotspot box */}
                  <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-[11px]">
                    <span className="text-amber-400 font-semibold flex items-center space-x-1 text-[10px] uppercase">
                      <Info className="w-3 h-3" />
                      <span>Why this is a hotspot</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{item.why_hotspot || 'High citizen demand combined with infrastructure and investment gaps makes this a high-priority hotspot.'}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-300 mt-3">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Est. Affected Pop: <strong>{item.estimated_affected_population?.toLocaleString()}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectHotspot(item)}
                  className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-semibold text-xs text-amber-400 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Recommendation</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
