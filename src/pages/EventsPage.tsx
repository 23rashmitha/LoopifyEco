import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  ArrowRight,
  MapPin,
  Users,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateEventReadiness } from '../utils/readiness';
import { EmptyState } from '../components/common/EmptyState';

export const EventsPage: React.FC = () => {
  const { events, inventory, reservations } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Events & Material Demands
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate material requirements against campus inventory before approving procurement or rental.
          </p>
        </div>

        <Link
          to="/events/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Campus Event</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Events Registered"
          description="Create your first event and specify its material requirements to calculate its reuse readiness score."
          actionLabel="Create Event"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt) => {
            const readiness = calculateEventReadiness(evt, inventory, reservations);
            const pct = readiness.readinessPercentage;

            return (
              <div
                key={evt.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {evt.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {evt.startDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.organizerName} &bull; {evt.departmentName.split('&')[0]}</span>
                    </div>
                  </div>

                  {/* Readiness Score Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Reuse Readiness</span>
                      </span>
                      <span className="font-mono font-extrabold text-slate-900">
                        {pct !== null ? `${pct}%` : 'No Requirements'}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct && pct >= 80 ? 'bg-emerald-600' : pct && pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{readiness.allocatableUnits} allocatable</span>
                      <span>{readiness.shortageUnits} shortage</span>
                    </div>
                  </div>

                  {/* Requirements Chips */}
                  <div className="flex flex-wrap gap-1">
                    {evt.requirements.slice(0, 3).map((r) => (
                      <span
                        key={r.id}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        {r.requestedQuantity}x {r.categoryName.split('&')[0]}
                      </span>
                    ))}
                    {evt.requirements.length > 3 && (
                      <span className="text-[10px] font-semibold text-slate-400 self-center">
                        +{evt.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card footer CTA */}
                <Link
                  to={`/events/${evt.id}/readiness`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <span>Check Readiness & Decision Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
