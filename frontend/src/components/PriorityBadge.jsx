import React from 'react';

export default function PriorityBadge({ score }) {
  const numScore = parseFloat(score);

  if (numScore >= 80) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse"></span>
        High ({numScore})
      </span>
    );
  } else if (numScore >= 60) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
        Medium ({numScore})
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
        Low ({numScore})
      </span>
    );
  }
}
