import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Building2,
  Check,
} from 'lucide-react';
import { CampusEvent, InventoryItem, Reservation } from '../../types';
import { calculateEventReadiness } from '../../utils/readiness';

interface ReadinessCardProps {
  event: CampusEvent;
  inventory: InventoryItem[];
  reservations: Reservation[];
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  event,
  inventory,
  reservations,
}) => {
  const readiness = calculateEventReadiness(event, inventory, reservations);

  const getMeterGradient = (pct: number | null) => {
    if (pct === null) return 'from-slate-300 to-slate-400';
    if (pct >= 80) return 'from-emerald-400 via-teal-400 to-cyan-500';
    if (pct >= 50) return 'from-amber-400 via-orange-400 to-amber-500';
    return 'from-rose-500 to-pink-500';
  };

  const getStatusBadge = (status: typeof readiness.status) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Reuse Ready</span>
          </span>
        );
      case 'PARTIALLY_READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200 shadow-2xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Partially Ready ({readiness.readinessPercentage}%)</span>
          </span>
        );
      case 'CRITICAL_SHORTAGE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Shortage Alert ({readiness.readinessPercentage}%)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Requirements Needed</span>
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-purple-100 shadow-lg shadow-purple-500/5 p-6 sm:p-7 transition-all">
      {/* Decorative subtle colorful gradient corner glows */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side: Event info & Innovation badge */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-mono shadow-xs">
              <Sparkles className="w-3 h-3 text-pink-200" />
              Event Reuse Readiness Score
            </span>
            <span className="text-xs font-semibold text-slate-400">Featured Campus Event</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-snug">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700 bg-pink-50 px-2.5 py-1 rounded-lg border border-pink-100">
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                {event.startDate} to {event.endDate}
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-violet-500" />
                {event.venue}
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                {event.departmentName.split('&')[0]}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
            Before buying or renting new supplies, <strong>Loopify</strong> verified real campus inventory, excluded damaged items, and calculated how much your event can fulfill through reuse.
          </p>
        </div>

        {/* Right side: Sleek colorful Readiness Meter */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50/50 border border-purple-100 rounded-3xl p-5 sm:p-6 lg:min-w-[340px] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Readiness Status
            </span>
            {getStatusBadge(readiness.status)}
          </div>

          {/* Progress gauge */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600">
                {readiness.readinessPercentage !== null ? `${readiness.readinessPercentage}%` : 'N/A'}
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {readiness.allocatableUnits} of {readiness.totalRequiredUnits} units ready
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${getMeterGradient(
                  readiness.readinessPercentage
                )} transition-all duration-700 ease-out shadow-xs`}
                style={{ width: `${readiness.readinessPercentage || 0}%` }}
                role="progressbar"
                aria-valuenow={readiness.readinessPercentage || 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Event reuse readiness: ${readiness.readinessPercentage || 0}%`}
              />
            </div>
          </div>

          {/* Colorful Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
              <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">Usable</span>
              <span className="text-lg font-black text-emerald-800 font-mono">
                {readiness.allocatableUnits}
              </span>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs">
              <span className="text-[10px] text-amber-700 font-bold block uppercase tracking-wider">In Triage</span>
              <span className="text-lg font-black text-amber-800 font-mono">
                {readiness.inspectionPendingUnits}
              </span>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200/80 shadow-2xs">
              <span className="text-[10px] text-rose-700 font-bold block uppercase tracking-wider">Shortage</span>
              <span className="text-lg font-black text-rose-800 font-mono">
                {readiness.shortageUnits}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <Link
            to={`/events/${event.id}/readiness`}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-fuchsia-500/20 active:scale-98"
          >
            <span>Run Reuse-First Decision Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
