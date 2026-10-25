import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  CalendarDays,
  FileCheck2,
  ArrowRightLeft,
  QrCode,
  ClipboardCheck,
  Wrench,
  BarChart3,
  Database,
  Sparkles,
  Infinity as InfinityIcon,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { reservations, inventory, inspections, repairs } = useApp();

  const pendingReservationsCount = reservations.filter((r) => r.status === 'PENDING').length;
  const pendingInspectionsCount = inventory.reduce((acc, i) => acc + (i.inspectionPendingQuantity || 0), 0);
  const activeRepairsCount = repairs.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'REPORTED').length;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-violet-400' },
    { to: '/inventory', label: 'Reusable Inventory', icon: Boxes, color: 'text-emerald-400' },
    { to: '/events', label: 'Campus Events', icon: CalendarDays, color: 'text-pink-400' },
    {
      to: '/reservations',
      label: 'Reservations',
      icon: FileCheck2,
      color: 'text-amber-400',
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    { to: '/handover', label: 'Handover & Return', icon: ArrowRightLeft, color: 'text-cyan-400' },
    { to: '/passport', label: 'QR Reuse Passport', icon: QrCode, color: 'text-fuchsia-400' },
    {
      to: '/inspections',
      label: 'Inspections Hub',
      icon: ClipboardCheck,
      color: 'text-teal-400',
      badge: pendingInspectionsCount > 0 ? pendingInspectionsCount : undefined,
      badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
    },
    {
      to: '/repairs',
      label: 'Repair Workshop',
      icon: Wrench,
      color: 'text-rose-400',
      badge: activeRepairsCount > 0 ? activeRepairsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    { to: '/reports', label: 'Impact & Bottlenecks', icon: BarChart3, color: 'text-purple-400' },
    { to: '/specs', label: 'MySQL & Architecture', icon: Database, color: 'text-indigo-400' },
  ];

  return (
    <aside className="w-64 h-full bg-[#130E26] text-slate-100 flex flex-col border-r border-[#241A45] select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#241A45]">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/30 group-hover:scale-105 transition-transform">
            <InfinityIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-pink-300 transition-colors">
                Loopify
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-2xs">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-violet-300/70 font-medium leading-tight mt-0.5">
              Campus Reuse Intelligence
            </p>
          </div>
        </NavLink>

        <div className="mt-3.5 px-3 py-2 rounded-xl bg-[#1C1438] text-[11px] text-pink-200/90 border border-[#31235F] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="leading-tight">&ldquo;Before buying new, discover what campus can reuse.&rdquo;</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-violet-400/60">
          Workflows & Features
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-900/40 font-bold'
                    : 'text-violet-200/75 hover:bg-[#201740] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono ${
                    item.badgeColor || 'bg-violet-500/30 text-violet-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer System Badge */}
      <div className="p-3.5 border-t border-[#241A45] bg-[#0E091E]/60 text-xs">
        <div className="p-2.5 rounded-xl bg-[#191136] border border-[#2D1F57] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-pink-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full-Stack Platform</span>
            </span>
            <span className="text-[10px] text-violet-400 font-mono">v2.0</span>
          </div>
          <p className="text-[10px] text-violet-300/70 leading-normal">
            React 19 &bull; Spring Boot REST &bull; MySQL 8.0 Concurrency Protected
          </p>
        </div>
      </div>
    </aside>
  );
};
