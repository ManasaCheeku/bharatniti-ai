import React from 'react';

export default function KPICard({ title, value, subtitle, icon: Icon, color = "amber" }) {
  const colorMap = {
    amber: "from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    blue: "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20",
    rose: "from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/20"
  };

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/80 border glass-card relative overflow-hidden group hover:border-slate-700 transition-all ${colorMap[color] || colorMap.amber}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 font-outfit tracking-tight">{value}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 ${colorMap[color].split(' ')[2]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
