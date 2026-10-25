import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, LayoutDashboard } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFE] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4 shadow-sm">
        <HelpCircle className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-pink-800 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
        404 &bull; Page Not Found
      </span>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
        Campus Resource Not Located
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
        The requested URL does not match any route in the Loopify directory. Check the navigation menu or return to the main dashboard.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Dashboard</span>
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors"
        >
          Public Portal
        </Link>
      </div>
    </div>
  );
};
