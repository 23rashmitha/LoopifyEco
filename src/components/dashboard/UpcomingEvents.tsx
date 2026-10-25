import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Layers, MapPin, Users } from 'lucide-react';
import { CampusEvent, InventoryItem, Reservation } from '../../types';
import { calculateEventReadiness } from '../../utils/readiness';
import { EmptyState } from '../common/EmptyState';

interface UpcomingEventsProps {
  events: CampusEvent[];
  inventory: InventoryItem[];
  reservations: Reservation[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  inventory,
  reservations,
}) => {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Upcoming Events"
        description="There are currently no events registered. Add an event to plan and calculate material reuse."
        actionLabel="Plan New Event"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Campus Events</h3>
          <p className="text-xs text-slate-500">Live reuse readiness score calculated for each event</p>
        </div>
        <Link
          to="/events"
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 transition-colors"
        >
          <span>View all events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {events.slice(0, 3).map((evt) => {
          const readiness = calculateEventReadiness(evt, inventory, reservations);
          const totalUnits = readiness.totalRequiredUnits;
          const allocatable = readiness.allocatableUnits;
          const pct = readiness.readinessPercentage;

          return (
            <div key={evt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{evt.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {evt.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {evt.startDate}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.venue}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {evt.organizerName}
                  </span>
                </div>
              </div>

              {/* Readiness mini gauge */}
              <div className="flex items-center gap-4 sm:shrink-0">
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="text-base font-extrabold text-slate-900 font-mono">
                      {pct !== null ? `${pct}%` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({allocatable}/{totalUnits} units)
                    </span>
                  </div>
                  <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${
                        pct && pct >= 80 ? 'bg-emerald-600' : pct && pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${pct || 0}%` }}
                    />
                  </div>
                </div>

                <Link
                  to={`/events/${evt.id}/readiness`}
                  className="p-2 rounded-xl text-emerald-800 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                  title="Check Readiness & Recommendations"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
