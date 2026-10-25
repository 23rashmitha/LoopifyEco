import React from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  CalendarPlus,
  FileCheck2,
  ArrowRightLeft,
  QrCode,
  Sparkles,
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      to: '/inventory',
      label: 'Browse Materials',
      desc: 'Discover gear across 5 campus hubs',
      icon: Boxes,
      cardBg: 'from-violet-500/10 to-indigo-500/10 border-violet-200 hover:border-violet-400',
      iconBg: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-500/25',
      badge: 'Live Stock',
      badgeColor: 'bg-violet-100 text-violet-800',
    },
    {
      to: '/events/new',
      label: 'Calculate Readiness',
      desc: 'Simulate material coverage for your fest',
      icon: CalendarPlus,
      cardBg: 'from-pink-500/10 to-rose-500/10 border-pink-200 hover:border-pink-400',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/25',
      badge: 'Algorithm #1',
      badgeColor: 'bg-pink-100 text-pink-800',
    },
    {
      to: '/reservations',
      label: 'Review Bookings',
      desc: 'Approve requests & prevent overlap',
      icon: FileCheck2,
      cardBg: 'from-amber-500/10 to-orange-500/10 border-amber-200 hover:border-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/25',
      badge: 'Zero Clashes',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      to: '/handover',
      label: 'Custody Handover',
      desc: 'Log physical pickup, return & condition',
      icon: ArrowRightLeft,
      cardBg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25',
      badge: 'Audit Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      to: '/passport',
      label: 'QR Reuse Passport',
      desc: 'Scan QR to view lifecycle and trips',
      icon: QrCode,
      cardBg: 'from-fuchsia-500/10 to-purple-500/10 border-fuchsia-200 hover:border-fuchsia-400',
      iconBg: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-sm shadow-fuchsia-500/25',
      badge: 'Innovation #3',
      badgeColor: 'bg-fuchsia-100 text-fuchsia-800',
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Interactive Quick Workflows</h3>
            <p className="text-[11px] text-slate-500">Pick any campus action to launch instant interactive flow</p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
          5 Core Hubs
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.to}
              to={act.to}
              className={`p-4 rounded-2xl bg-gradient-to-b ${act.cardBg} border transition-all text-left flex flex-col justify-between space-y-3 group hover:shadow-md hover:-translate-y-0.5 duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${act.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${act.badgeColor}`}>
                  {act.badge}
                </span>
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 group-hover:text-violet-900 transition-colors">
                  {act.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
