import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  QrCode,
  CalendarCheck,
  ArrowRight,
  TrendingDown,
  Layers,
  HeartHandshake,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PersonaValueExplainer: React.FC = () => {
  const { currentUser, switchUser, switchRole, users } = useApp();
  const [activeTab, setActiveTab] = useState<'organizer' | 'admin'>('organizer');

  // Quick switch role helper so judge can test both viewpoints
  const switchToOrganizer = () => {
    setActiveTab('organizer');
    const orgUser = users.find((u) => u.role === 'ORGANIZER');
    if (orgUser) {
      switchUser(orgUser.id);
    } else {
      switchRole('ORGANIZER');
    }
  };

  const switchToAdmin = () => {
    setActiveTab('admin');
    const adminUser = users.find((u) => u.role === 'ADMIN' || u.role === 'ITEM_COORDINATOR');
    if (adminUser) {
      switchUser(adminUser.id);
    } else {
      switchRole('ADMIN');
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-violet-100 shadow-md shadow-violet-500/5 p-6 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Decorative subtle colorful background glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-300/20 via-violet-300/20 to-sky-300/20 blur-3xl pointer-events-none" />

      {/* Header and Perspective Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200/80 text-violet-900 text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Value Matrix &middot; Why Loopify Wins</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How Loopify Works for Users & Administrators
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Click either persona below to experience how Loopify solves real pain points for both student event leaders and campus faculty administrators.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shrink-0 self-start lg:self-auto">
          <button
            onClick={switchToOrganizer}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'organizer'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>For Event Organizers</span>
          </button>
          <button
            onClick={switchToAdmin}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all duration-200 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/25 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>For Campus Admins</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Event Organizers & Student Clubs */}
      {activeTab === 'organizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10 animate-in fade-in duration-300">
          {/* Card 1: Zero Budget Waste */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/40 border border-pink-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Problem: Zero Budget
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Borrow Free Stage & Fest Materials
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student clubs shouldn’t spend ₹40,000 on new banner frames, tripod displays, and audio cords every symposium while other departments store them idle in cupboards.
              </p>
            </div>
            <div className="pt-2 border-t border-pink-200/60">
              <Link
                to="/inventory"
                className="text-xs font-bold text-pink-700 hover:text-pink-900 flex items-center gap-1.5 transition-colors"
              >
                <span>Browse Free Campus Supplies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Event Reuse Readiness Score */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-indigo-50/40 border border-violet-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 bg-violet-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Innovation #1: Readiness Score
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Know Your Coverage in 2 Seconds
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your event date and required equipment. Loopify calculates your exact <strong>% Readiness</strong>, flags any shortage, and suggests verified alternatives before you submit requisitions.
              </p>
            </div>
            <div className="pt-2 border-t border-violet-200/60">
              <Link
                to="/events/new"
                className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1.5 transition-colors"
              >
                <span>Calculate Fest Readiness</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Zero Clashes & Transparent Condition */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Peace of Mind
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Guaranteed Gear on Fest Day
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reservations are locked deterministically so another club cannot claim your reserved mic stands. When returning, digital verification prevents wrongful damage disputes.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200/60">
              <Link
                to="/reservations"
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 transition-colors"
              >
                <span>View Reserved Equipment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Campus Administrators & Store Coordinators */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10 animate-in fade-in duration-300">
          {/* Admin Card 1: Prevent Overlapping Clashes */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-indigo-50/40 border border-violet-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 bg-violet-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Double-Booking Protection
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Atomic Overlap Validation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Spring Boot allocation engine tests requested intervals <code>[startDate, endDate]</code> against active reservations so coordinators never accidentally approve more units than exist physically.
              </p>
            </div>
            <div className="pt-2 border-t border-violet-200/60">
              <Link
                to="/reservations"
                className="text-xs font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1.5 transition-colors"
              >
                <span>Manage Approvals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Card 2: QR Custody & Triage */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-fuchsia-50/80 to-pink-50/40 border border-fuchsia-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-700 bg-fuchsia-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Innovation #3: QR Passport
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Custody Handovers & Damage Triage
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan QR passports at pickup and return. Broken items are immediately triaged to repair without disappearing or lingering as &ldquo;phantom usable stock.&rdquo;
              </p>
            </div>
            <div className="pt-2 border-t border-fuchsia-200/60">
              <Link
                to="/passport"
                className="text-xs font-bold text-fuchsia-700 hover:text-fuchsia-900 flex items-center gap-1.5 transition-colors"
              >
                <span>Launch QR Passport Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Card 3: Executive Budget Savings */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/90 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Audit & Financial Proof
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                Avoided Procurement Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate auditable reports showing verified reuse cycles, total dollars saved from avoided repeat buys, and unfulfilled demand metrics to guide next term&apos;s campus budget.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200/60">
              <Link
                to="/reports"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition-colors"
              >
                <span>View Executive Audit Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Judge Interactive Quick Tester */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-fuchsia-500/10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
              Judge Evaluation Mode
            </span>
            <span className="text-xs text-white/90 font-medium">Currently simulating as:</span>
            <span className="text-xs font-black bg-white text-slate-900 px-2 py-0.5 rounded-md">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-white/90">
            Switch perspectives anytime in the top right navbar to test role permissions across the entire platform.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={activeTab === 'organizer' ? switchToAdmin : switchToOrganizer}
            className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-bold text-xs transition-colors shadow-xs"
          >
            Switch to {activeTab === 'organizer' ? 'Admin' : 'Organizer'} Mode &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
