import React from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  CalendarDays,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { ReadinessCard } from '../components/dashboard/ReadinessCard';
import { UpcomingEvents } from '../components/dashboard/UpcomingEvents';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ImpactSummary } from '../components/dashboard/ImpactSummary';
import { QuickActions } from '../components/dashboard/QuickActions';
import { PersonaValueExplainer } from '../components/dashboard/PersonaValueExplainer';

export const DashboardPage: React.FC = () => {
  const {
    inventory,
    events,
    reservations,
    returns,
    repairs,
    lifecycleEvents,
    unfulfilledRequests,
    categories,
    currentUser,
  } = useApp();

  // Metrics calculation
  const totalItemsCount = inventory.length;
  const totalPhysicalUnits = inventory.reduce((acc, i) => acc + i.totalQuantity, 0);
  const totalUsableUnits = inventory.reduce((acc, i) => acc + i.usableQuantity, 0);
  const pendingReservations = reservations.filter((r) => r.status === 'PENDING').length;
  const verifiedReusedUnits = returns.reduce((acc, r) => acc + r.quantityReturned, 0);

  // Marquee event for feature card (e.g. EnGenius or first upcoming event)
  const marqueeEvent = events[0];

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Loopify Colorful Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white p-6 sm:p-8 shadow-lg shadow-purple-500/15 border border-purple-400/30">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 flex items-center gap-1.5 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                <span>Loopify Campus Engine</span>
              </span>
              <span className="text-xs text-purple-100 font-medium">
                Active as <span className="font-bold underline decoration-pink-300 underline-offset-2">{currentUser.fullName}</span> ({currentUser.role.replace('_', ' ')})
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Before buying new, discover what your campus can reuse.
            </h1>
            
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal">
              Empowering college student clubs to borrow verified stage gear, banners, and audio equipment for free—while giving campus store admins zero-clash scheduling and QR custody tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/events/new"
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-violet-950 font-black text-xs flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarDays className="w-4 h-4 text-violet-600" />
              <span>Plan Event Readiness</span>
            </Link>
            <Link
              to="/inventory"
              className="px-5 py-3 rounded-2xl bg-violet-950/40 hover:bg-violet-950/60 text-white font-bold text-xs flex items-center gap-2 transition-colors border border-white/20 backdrop-blur-sm"
            >
              <Boxes className="w-4 h-4 text-pink-300" />
              <span>Browse Materials</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Value for Users & Administrators Interactive Matrix */}
      <PersonaValueExplainer />

      {/* Colorful Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cataloged Stock"
          value={totalPhysicalUnits}
          subtitle={`${totalItemsCount} material lots tracked`}
          icon={Boxes}
          color="violet"
          badge="Verified"
          footnote="Across 5 active campus hubs"
        />

        <StatCard
          title="Immediately Usable"
          value={totalUsableUnits}
          subtitle="Allocatable without waiting"
          icon={CheckCircle2}
          color="emerald"
          badge="100% Ready"
          footnote="Excludes damaged or in-triage items"
        />

        <StatCard
          title="Pending Requests"
          value={pendingReservations}
          subtitle="Awaiting coordinator review"
          icon={Clock}
          color="amber"
          badge={pendingReservations > 0 ? 'Action Needed' : 'All Clear'}
          footnote="Double-booking prevention active"
        />

        <StatCard
          title="Verified Reuses"
          value={verifiedReusedUnits}
          subtitle="Units safely returned & checked"
          icon={RotateCcw}
          color="fuchsia"
          badge="Audited"
          footnote="Reservations are not counted until verified"
        />
      </div>

      {/* Feature 1 Innovation Card: Event Reuse Readiness Score */}
      {marqueeEvent && (
        <ReadinessCard
          event={marqueeEvent}
          inventory={inventory}
          reservations={reservations}
        />
      )}

      {/* Interactive Quick Workflows */}
      <QuickActions />

      {/* Two Column Grid: Upcoming Events & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEvents
          events={events}
          inventory={inventory}
          reservations={reservations}
        />
        <RecentActivity events={lifecycleEvents} />
      </div>

      {/* Impact & Avoided Spend Summary */}
      <ImpactSummary
        returns={returns}
        repairs={repairs}
        unfulfilledRequests={unfulfilledRequests}
        inventory={inventory}
        categories={categories}
      />
    </div>
  );
};
