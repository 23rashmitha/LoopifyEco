import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Boxes,
  RotateCcw,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  CalendarCheck,
  TrendingDown,
  Layers,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { inventory } = useApp();

  // Interactive Live Simulator State on Landing Page
  const [simBoards, setSimBoards] = useState(10);
  const [simBanners, setSimBanners] = useState(4);
  const [simCables, setSimCables] = useState(6);

  // Available stock in mock inventory
  const availableBoards = 6;
  const availableBanners = 6;
  const availableCables = 10;

  const totalRequired = simBoards + simBanners + simCables;
  const allocatable =
    Math.min(simBoards, availableBoards) +
    Math.min(simBanners, availableBanners) +
    Math.min(simCables, availableCables);

  const simPct = totalRequired > 0 ? Math.round((allocatable / totalRequired) * 100) : 0;
  const shortage = Math.max(0, totalRequired - allocatable);

  return (
    <div className="min-h-screen bg-[#FAFAFE] text-slate-900 selection:bg-pink-300 selection:text-violet-950 font-sans">
      {/* Top Navigation */}
      <nav className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-violet-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900">Loopify</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 text-violet-800 border border-violet-200">
                CAMPUS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Smart Event Material Reuse Network</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-violet-700 transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-violet-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-14 pb-20 px-6 sm:px-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Colorful background ambient gradients */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-violet-400/15 via-fuchsia-400/15 to-pink-400/15 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-100 via-fuchsia-100 to-pink-100 text-violet-950 text-xs font-black border border-violet-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
            <span>&ldquo;Before buying new, discover what your campus can reuse.&rdquo;</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            The Colorful, Verified Reuse Network for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500">
              College Event Materials
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Every semester, student clubs waste thousands on poster stands, stage lights, and cables that other departments already own. <strong>Loopify</strong> connects college materials with live readiness algorithms, double-booking prevention, and QR custody passports.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>Explore Live Campus Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/specs"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-xs transition-colors"
            >
              MySQL &amp; Spring Boot Specs
            </Link>
          </div>
        </div>

        {/* Dual Persona Highlight Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto relative z-10">
          <div className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full inline-block">
                For Student Clubs &amp; Organizers
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">Borrow High-Cost Gear for $0</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Save club funds for guest speakers and catering. Get instant readiness scores and guaranteed equipment without clash surprises.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-violet-200 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full inline-block">
                For Campus Administrators
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">Zero Overlapping Clashes &amp; Full Audit</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track every checkout with digital QR passports, automate damaged item triage, and verify avoided procurement expenses.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE READINESS SIMULATOR WIDGET */}
        <div className="mt-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border border-violet-800/50 space-y-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-slate-950 font-mono shadow-xs">
                Interactive Innovation 1 Simulator
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                Event Reuse Readiness Calculator
              </h2>
              <p className="text-xs text-purple-200/80">
                Drag the sliders below to see how Loopify calculates verified readiness and flags shortages in real time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-5">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">Readiness Score</span>
                <span className="text-4xl font-black text-pink-400 font-mono">{simPct}%</span>
              </div>
              <div className="text-right text-xs font-mono border-l border-white/15 pl-4 space-y-0.5">
                <p className="text-emerald-300 font-bold">{allocatable} / {totalRequired} Ready</p>
                <p className="text-rose-300 font-bold">Shortage: {shortage} Units</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Display boards slider */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-200">Display Boards</span>
                <span className="font-mono text-pink-300">{simBoards} Required</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={simBoards}
                onChange={(e) => setSimBoards(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
                <span>Central Store: 6 ready</span>
                <span className="text-emerald-300 font-bold">{Math.min(simBoards, 6)} allocated</span>
              </div>
            </div>

            {/* Banner stands slider */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-200">Banner Stands</span>
                <span className="font-mono text-pink-300">{simBanners} Required</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={simBanners}
                onChange={(e) => setSimBanners(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
                <span>Mech Dept: 6 ready</span>
                <span className="text-emerald-300 font-bold">{Math.min(simBanners, 6)} allocated</span>
              </div>
            </div>

            {/* Extension cords slider */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-200">Extension Cords</span>
                <span className="font-mono text-pink-300">{simCables} Required</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={simCables}
                onChange={(e) => setSimCables(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-purple-300/70 font-mono">
                <span>EEE Lab: 10 ready</span>
                <span className="text-emerald-300 font-bold">{Math.min(simCables, 10)} allocated</span>
              </div>
            </div>
          </div>

          {/* Decision Assistant Recommendation Result Preview */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-pink-300 uppercase tracking-wider">
                Innovation 2: Reuse-First Decision Recommendation
              </span>
              <p className="text-purple-100 font-medium">
                {shortage === 0
                  ? 'All event requirements are 100% fulfilled by verified campus inventory. Zero purchasing required!'
                  : `Allocate the ${allocatable} reusable units from campus hubs. Procure only the confirmed shortage of ${shortage} units.`}
              </p>
            </div>
            <Link
              to="/events"
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs shrink-0 text-center transition-colors shadow-xs"
            >
              Test with Real Campus Events &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* The 3 Signature Innovations Showcase */}
      <section className="py-20 bg-white border-y border-violet-100 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
              The Three Core Differentiators
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight pt-1">
              Engineered for Real Campus Operations
            </h2>
            <p className="text-sm text-slate-500">
              Loopify connects material discovery with predictive readiness before events, condition oversight during events, and lost-opportunity tracking after events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-violet-50/50 to-white border border-violet-100 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Event Reuse Readiness Score</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before purchasing, organizers enter material needs. The engine checks usable stock, excludes damaged or inspection-pending items, and calculates the exact proportion fulfilled through reuse.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-pink-50/50 to-white border border-pink-100 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Reuse-First Decision Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides actionable recommendations with transparent rationale: reuse existing stock, inspect suitable items pending verification, check other departments, or procure only the remaining shortage.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-b from-fuchsia-50/50 to-white border border-fuchsia-100 space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-fuchsia-500/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Reuse Chain &amp; Lost-Opportunity Tracker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unique QR codes unlock an immutable lifecycle passport showing checkouts, returns, repairs, and verified reuse count. Unfulfilled demands are tracked to help deans plan future resource stockpiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Loopify Campus. A Verified, Intelligent Reuse System for College Event Materials.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link to="/specs" className="hover:text-violet-700 underline">MySQL Architecture</Link>
            <Link to="/dashboard" className="hover:text-violet-700 underline">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
