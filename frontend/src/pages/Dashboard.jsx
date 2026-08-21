import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Info, 
  ArrowUpRight, 
  Filter,
  Sparkles,
  Layers,
  Smartphone,
  Globe2,
  Volume2
} from 'lucide-react';
import KPICard from '../components/KPICard';
import PriorityBadge from '../components/PriorityBadge';
import { 
  fetchDashboardSummary, 
  fetchCategoryDistribution, 
  fetchStateDistribution, 
  fetchAllRequests 
} from '../services/api';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4', '#14b8a6'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  useEffect(() => {
    Promise.all([
      fetchDashboardSummary(),
      fetchCategoryDistribution(),
      fetchStateDistribution(),
      fetchAllRequests()
    ]).then(([sum, cat, st, reqs]) => {
      setSummary(sum);
      setCategoriesData(cat);
      setStatesData(st);
      setRequests(reqs);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredRequests = requests.filter(r => {
    if (selectedStateFilter && !r.state.toLowerCase().includes(selectedStateFilter.toLowerCase())) return false;
    if (selectedCategoryFilter && !r.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())) return false;
    return true;
  });

  const priorityPieData = [
    { name: 'High Priority (≥80)', value: summary?.high_priority_count || 0, color: '#f43f5e' },
    { name: 'Medium Priority (60-79)', value: summary?.medium_priority_count || 0, color: '#f59e0b' },
    { name: 'Low Priority (<60)', value: summary?.low_priority_count || 0, color: '#10b981' }
  ];

  const channelData = summary?.channel_distribution || [
    { channel: 'Web', count: 18 },
    { channel: 'Voice', count: 18 },
    { channel: 'Messaging App', count: 14 }
  ];

  const languageData = summary?.language_distribution || [
    { language: 'Bengali', count: 12 },
    { language: 'Kannada', count: 10 },
    { language: 'Hindi', count: 10 },
    { language: 'Tamil', count: 8 },
    { language: 'Telugu', count: 6 },
    { language: 'English', count: 4 }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Loading Policymaker Intelligence Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* TITLE & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Digital Public Infrastructure Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">Policymaker Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
            <span>From fragmented citizen feedback to evidence-backed development priorities.</span>
            <span className="text-amber-400 font-semibold">(Built for India. Designed for BRICS.)</span>
          </p>
        </div>

        <Link
          to="/recommendations"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Policy Brief</span>
        </Link>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Citizen Requests"
          value={summary?.total_requests?.toLocaleString() || '0'}
          subtitle="Seeded across 10 Indian States"
          icon={Activity}
          color="blue"
        />
        <KPICard
          title="High Priority Requests"
          value={summary?.high_priority_count?.toLocaleString() || '0'}
          subtitle="Score ≥ 80 / 100"
          icon={AlertTriangle}
          color="rose"
        />
        <KPICard
          title="Development Hotspots"
          value={summary?.hotspots_count?.toLocaleString() || '0'}
          subtitle="High urgency regional clusters"
          icon={MapPin}
          color="amber"
        />
        <KPICard
          title="Estimated Population Affected"
          value={summary?.estimated_population_affected?.toLocaleString() || '0'}
          subtitle="Citizen population footprint"
          icon={Users}
          color="emerald"
        />
      </div>

      {/* DEVELOPMENT INTELLIGENCE SUMMARY SECTION */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-outfit flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Development Intelligence Matrix</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono">Infrastructure & Public Investment Analysis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Citizen Demand</p>
            <p className="text-lg font-bold text-amber-400">{summary?.total_requests} Requests</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Infra Gap Avg</p>
            <p className="text-lg font-bold text-rose-400">81.4 / 100</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Public Investment Gap</p>
            <p className="text-lg font-bold text-purple-400">64.5% Deficit</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Population Impact</p>
            <p className="text-lg font-bold text-blue-400">1.7M Citizens</p>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Development Priority</p>
            <p className="text-lg font-bold text-emerald-400">High (83.2/100)</p>
          </div>
        </div>
      </div>

      {/* MULTILINGUAL REACH & CHANNEL ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Citizen Languages Distribution Bar Chart */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 font-outfit mb-4 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Citizen Languages Distribution</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">5 Regional + English</span>
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="language" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution Chart */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 font-outfit mb-2 flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Citizen Requests by Intake Channel</span>
          </h3>
          <div className="h-44 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="channel"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-ch-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-[11px] pt-2 border-t border-slate-800">
            {channelData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span>{item.channel}</span>
                </span>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CHARTS SECTION 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 font-outfit mb-4 flex items-center justify-between">
            <span>Requests by Infrastructure Category</span>
            <span className="text-xs text-slate-400 font-normal">Demand Volume</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-200 font-outfit mb-2">Priority Distribution</h3>
          <div className="h-52 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-[11px] pt-2 border-t border-slate-800">
            {priorityPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PRIORITY REQUESTS TABLE */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white font-outfit">Citizen Requests Priority Ledger</h3>
            <p className="text-xs text-slate-400">Ranked by AI Development Priority Score</p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="text"
              placeholder="Filter state..."
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Filter category..."
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Language & Channel</th>
                <th className="py-3 px-3">Summary / Request</th>
                <th className="py-3 px-3">Urgency</th>
                <th className="py-3 px-3">Priority Score</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-white">{req.district}</p>
                    <p className="text-[10px] text-slate-400">{req.state}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-amber-400">{req.category}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      {req.detected_language} ({req.source || 'Web'})
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="line-clamp-2 text-slate-200">{req.issue_summary || req.original_text}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-rose-300 font-bold">{req.urgency}</span>
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge score={req.priority_score} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/recommendations?state=${encodeURIComponent(req.state)}&district=${encodeURIComponent(req.district)}&category=${encodeURIComponent(req.category)}`}
                      className="inline-flex items-center space-x-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <span>Policy Brief</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
