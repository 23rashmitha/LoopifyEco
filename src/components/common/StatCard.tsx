import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'slate' | 'coral' | 'violet' | 'fuchsia';
  footnote?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = 'violet',
  footnote,
}) => {
  const colorMap = {
    violet: {
      bg: 'bg-gradient-to-br from-violet-50/90 to-indigo-50/50',
      border: 'border-violet-200/80 hover:border-violet-300',
      topLine: 'bg-gradient-to-r from-violet-500 to-indigo-500',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xs shadow-violet-500/20',
      badgeBg: 'bg-violet-100 text-violet-800 border border-violet-200/60',
      glow: 'group-hover:shadow-violet-500/10',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50/90 to-teal-50/50',
      border: 'border-emerald-200/80 hover:border-emerald-300',
      topLine: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs shadow-emerald-500/20',
      badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200/60',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    blue: {
      bg: 'bg-gradient-to-br from-sky-50/90 to-blue-50/50',
      border: 'border-blue-200/80 hover:border-blue-300',
      topLine: 'bg-gradient-to-r from-sky-500 to-blue-600',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs shadow-blue-500/20',
      badgeBg: 'bg-blue-100 text-blue-800 border border-blue-200/60',
      glow: 'group-hover:shadow-blue-500/10',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50/90 to-orange-50/50',
      border: 'border-amber-200/80 hover:border-amber-300',
      topLine: 'bg-gradient-to-r from-amber-500 to-orange-500',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xs shadow-amber-500/20',
      badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200/60',
      glow: 'group-hover:shadow-amber-500/10',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50/90 to-pink-50/50',
      border: 'border-purple-200/80 hover:border-purple-300',
      topLine: 'bg-gradient-to-r from-purple-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xs shadow-purple-500/20',
      badgeBg: 'bg-purple-100 text-purple-800 border border-purple-200/60',
      glow: 'group-hover:shadow-purple-500/10',
    },
    fuchsia: {
      bg: 'bg-gradient-to-br from-fuchsia-50/90 to-rose-50/50',
      border: 'border-fuchsia-200/80 hover:border-fuchsia-300',
      topLine: 'bg-gradient-to-r from-fuchsia-500 to-rose-500',
      iconBg: 'bg-gradient-to-br from-fuchsia-500 to-rose-600 text-white shadow-xs shadow-fuchsia-500/20',
      badgeBg: 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200/60',
      glow: 'group-hover:shadow-fuchsia-500/10',
    },
    coral: {
      bg: 'bg-gradient-to-br from-rose-50/90 to-pink-50/50',
      border: 'border-rose-200/80 hover:border-rose-300',
      topLine: 'bg-gradient-to-r from-rose-500 to-pink-500',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xs shadow-rose-500/20',
      badgeBg: 'bg-rose-100 text-rose-800 border border-rose-200/60',
      glow: 'group-hover:shadow-rose-500/10',
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      topLine: 'bg-slate-400',
      iconBg: 'bg-slate-700 text-white',
      badgeBg: 'bg-slate-200 text-slate-800',
      glow: '',
    },
  };

  const scheme = colorMap[color] || colorMap.violet;

  return (
    <div className={`group p-5 rounded-3xl bg-white border ${scheme.border} shadow-sm hover:shadow-md ${scheme.glow} transition-all relative overflow-hidden flex flex-col justify-between`}>
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${scheme.topLine}`} />
      
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{title}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">{value}</span>
              {badge && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${scheme.badgeBg}`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${scheme.iconBg} shrink-0 transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {subtitle && <p className="text-xs text-slate-600 font-medium mt-2">{subtitle}</p>}
      </div>

      {footnote && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>{footnote}</span>
        </div>
      )}
    </div>
  );
};
