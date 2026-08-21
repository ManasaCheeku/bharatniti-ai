import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-200 font-outfit text-sm">
            BharatNiti <span className="text-amber-400">AI</span> — Digital Public Infrastructure & Governance
          </p>
          <p className="text-slate-500 mt-1">
            Built for <strong className="text-slate-300">Build with AI: Code for Communities — Second Edition</strong> Hackathon (Track 1)
          </p>
        </div>

        <div className="flex items-center space-x-4 text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Synthetic Demo Dataset & AI Decision Support</span>
          </span>
        </div>

        <div className="text-slate-500 text-right">
          <p>© 2026 BharatNiti AI. Powered by Google Gemini API & FastAPI.</p>
        </div>
      </div>
    </footer>
  );
}
