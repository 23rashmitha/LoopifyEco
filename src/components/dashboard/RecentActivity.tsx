import React from 'react';
import {
  PackagePlus,
  ArrowRightLeft,
  RotateCcw,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ItemLifecycleEvent, LifecycleEventType } from '../../types';
import { EmptyState } from '../common/EmptyState';

interface RecentActivityProps {
  events: ItemLifecycleEvent[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No Activity Records"
        description="No inventory activity has been logged yet."
      />
    );
  }

  const getActivityIcon = (type: LifecycleEventType) => {
    switch (type) {
      case 'REGISTERED':
        return <PackagePlus className="w-4 h-4 text-emerald-700" />;
      case 'HANDED_OVER':
        return <ArrowRightLeft className="w-4 h-4 text-purple-700" />;
      case 'RETURNED':
        return <RotateCcw className="w-4 h-4 text-blue-700" />;
      case 'INSPECTION_COMPLETED':
        return <ClipboardCheck className="w-4 h-4 text-teal-700" />;
      case 'DAMAGE_REPORTED':
      case 'REPAIR_STARTED':
      case 'REPAIR_VERIFIED':
        return <Wrench className="w-4 h-4 text-amber-700" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-700" />;
    }
  };

  const getActivityBadgeColor = (type: LifecycleEventType) => {
    switch (type) {
      case 'REGISTERED':
        return 'bg-emerald-100 border-emerald-200';
      case 'HANDED_OVER':
        return 'bg-purple-100 border-purple-200';
      case 'RETURNED':
        return 'bg-blue-100 border-blue-200';
      case 'INSPECTION_COMPLETED':
        return 'bg-teal-100 border-teal-200';
      case 'DAMAGE_REPORTED':
      case 'REPAIR_STARTED':
        return 'bg-amber-100 border-amber-200';
      default:
        return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Campus Reuse Activity</h3>
          <p className="text-xs text-slate-500">Traceable lifecycle events across departments</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Sample Verified Log
        </span>
      </div>

      <div className="space-y-3">
        {events.slice(0, 5).map((evt) => (
          <div
            key={evt.id}
            className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors flex items-start gap-3.5"
          >
            <div className={`p-2 rounded-xl border shrink-0 ${getActivityBadgeColor(evt.eventType)}`}>
              {getActivityIcon(evt.eventType)}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {evt.actorName} &bull; <span className="font-normal text-slate-500">{evt.actorRole}</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {new Date(evt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">{evt.eventDescription}</p>
              {evt.conditionObserved && (
                <span className="text-[10px] text-emerald-800 font-medium inline-block mt-1">
                  Condition: {evt.conditionObserved.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
