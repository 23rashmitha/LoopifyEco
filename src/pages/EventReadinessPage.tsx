import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ShoppingCart,
  Calendar,
  Layers,
  Building,
  ArrowRight,
  ClipboardCheck,
  Check,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateEventReadiness } from '../utils/readiness';
import { generateReuseRecommendations } from '../utils/decisionAssistant';
import { StatusBadge } from '../components/common/StatusBadge';
import confetti from 'canvas-confetti';

export const EventReadinessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, inventory, reservations, createReservation } = useApp();

  const [reserveSuccessMsg, setReserveSuccessMsg] = useState('');

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested event could not be found.</p>
        <Link to="/events" className="mt-4 inline-block text-xs font-semibold text-emerald-800 underline">
          Return to Events
        </Link>
      </div>
    );
  }

  const readiness = calculateEventReadiness(event, inventory, reservations);
  const recommendations = generateReuseRecommendations(event, inventory, reservations);

  const handleApplyAllReusable = () => {
    // Collect all allocatable items from the breakdown
    const itemsToRequest: { inventoryItemId: string; quantity: number }[] = [];

    readiness.breakdown.forEach((detail) => {
      let needed = detail.allocatableQuantity;
      for (const item of detail.matchingItems) {
        if (needed <= 0) break;
        const take = Math.min(needed, item.availableNow);
        if (take > 0) {
          itemsToRequest.push({ inventoryItemId: item.itemId, quantity: take });
          needed -= take;
        }
      }
    });

    if (itemsToRequest.length > 0) {
      createReservation(event.id, itemsToRequest);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      setReserveSuccessMsg('Reservation request automatically generated for all allocatable reusable stock!');
      setTimeout(() => {
        navigate('/reservations');
      }, 1500);
    }
  };

  const getMeterColor = (pct: number | null) => {
    if (pct === null) return 'bg-slate-300';
    if (pct >= 80) return 'bg-emerald-600';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back button */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events List</span>
      </Link>

      {/* Success notification banner */}
      {reserveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{reserveSuccessMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#123B2A] to-[#0A261B] text-white border border-emerald-800 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400 text-emerald-950 font-mono">
                Innovation Features 1 & 2
              </span>
              <span className="text-xs text-emerald-300">Readiness Score & Decision Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-lime-300" />
                {event.startDate} to {event.endDate}
              </span>
              <span>&bull;</span>
              <span>Venue: {event.venue}</span>
              <span>&bull;</span>
              <span>Organizer: {event.organizerName} ({event.departmentName})</span>
            </div>
          </div>

          {/* Quick Apply CTA */}
          {readiness.allocatableUnits > 0 && (
            <button
              onClick={handleApplyAllReusable}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-emerald-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>Reserve All Allocatable Units ({readiness.allocatableUnits})</span>
            </button>
          )}
        </div>

        {/* Readiness Meter & Pill Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-emerald-800/80">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 space-y-1.5 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Event Readiness Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">
                {readiness.readinessPercentage !== null ? `${readiness.readinessPercentage}%` : 'N/A'}
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
              <div
                className={`h-full rounded-full ${getMeterColor(readiness.readinessPercentage)}`}
                style={{ width: `${readiness.readinessPercentage || 0}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 space-y-1 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Allocatable from Stock
            </span>
            <p className="text-3xl font-extrabold text-lime-300 font-mono">
              {readiness.allocatableUnits} <span className="text-xs text-emerald-400 font-normal">/ {readiness.totalRequiredUnits} units</span>
            </p>
            <p className="text-[11px] text-emerald-300/70">Verified ready across departments</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 space-y-1 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Inspection Pending
            </span>
            <p className="text-3xl font-extrabold text-amber-300 font-mono">
              {readiness.inspectionPendingUnits} <span className="text-xs text-amber-400 font-normal">units</span>
            </p>
            <p className="text-[11px] text-amber-200/70">Could cover part/all of shortage</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/40 space-y-1 md:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
              Confirmed Shortage
            </span>
            <p className="text-3xl font-extrabold text-rose-300 font-mono">
              {readiness.shortageUnits} <span className="text-xs text-rose-400 font-normal">units</span>
            </p>
            <p className="text-[11px] text-rose-200/70">Must be purchased or rented</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Material-by-Material Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-800" />
            <span>Material Demand vs. Verified Inventory Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500">
            Formula: Readiness = (Allocatable reusable units &divide; Total required units) &times; 100. Overlapping bookings & pending stock are strictly excluded.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Material Category</th>
                <th className="py-3 px-4 text-center">Required Units</th>
                <th className="py-3 px-4 text-center">Allocatable Ready</th>
                <th className="py-3 px-4 text-center">Pending Inspection</th>
                <th className="py-3 px-4 text-center">Remaining Shortage</th>
                <th className="py-3 px-4">Available Source Items</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {readiness.breakdown.map((row) => (
                <tr key={row.requirementId} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{row.categoryName}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                    {row.requestedQuantity}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-800 bg-emerald-50/50">
                    {row.allocatableQuantity}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-amber-700 bg-amber-50/30">
                    {row.inspectionPendingQuantity}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-700 bg-rose-50/30">
                    {row.shortageQuantity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {row.matchingItems.length === 0 ? (
                      <span className="text-slate-400 italic">No inventory in catalog</span>
                    ) : (
                      <div className="space-y-1">
                        {row.matchingItems.map((m) => (
                          <div key={m.itemId} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span className="font-semibold text-slate-800">{m.itemName}</span>
                            <span className="text-slate-400 font-mono">({m.availableNow} ready &bull; {m.departmentName.split('&')[0]})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {row.status === 'FULFILLED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>100% Ready</span>
                      </span>
                    ) : row.status === 'PARTIAL' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Partial Match</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Unavailable</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: INNOVATION 2 — Reuse-First Decision Assistant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono">
                Innovation Feature 2
              </span>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Reuse-First Decision Assistant Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Practical next actions for each requirement: reuse existing stock, conduct pending inspections, or purchase only confirmed shortages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const isFullReuse = rec.action === 'REUSE_EXISTING';
            const isInspect = rec.action === 'INSPECT_BEFORE_USE';
            const isRepair = rec.action === 'REPAIR_THEN_REASSESS';
            const isPurchase = rec.action === 'PURCHASE_REMAINING_SHORTAGE';

            return (
              <div
                key={rec.requirementId}
                className={`p-5 rounded-3xl border shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  isFullReuse
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isInspect
                    ? 'bg-amber-50/50 border-amber-200'
                    : isRepair
                    ? 'bg-teal-50/50 border-teal-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{rec.categoryName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFullReuse
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInspect
                          ? 'bg-amber-100 text-amber-800'
                          : isRepair
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {rec.action.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white shadow-2xs">
                      {isFullReuse && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
                      {isInspect && <ClipboardCheck className="w-5 h-5 text-amber-700" />}
                      {isRepair && <Wrench className="w-5 h-5 text-teal-700" />}
                      {isPurchase && <ShoppingCart className="w-5 h-5 text-slate-700" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{rec.actionLabel}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Requested: {rec.requestedQuantity} &bull; Reuse suggested: {rec.suggestedReusableQuantity} &bull; Shortage: {rec.remainingShortage}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-2xl border border-slate-100">
                    {rec.reason}
                  </p>

                  {rec.dependencyNote && (
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{rec.dependencyNote}</span>
                    </div>
                  )}

                  {rec.alternativeOptions && (
                    <p className="text-[11px] text-slate-500">
                      <strong>Cross-Department Holding:</strong> {rec.alternativeOptions.join(', ')}
                    </p>
                  )}
                </div>

                {/* Specific Action Buttons */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  {isInspect && (
                    <Link
                      to="/inspections"
                      className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                    >
                      Go to Inspections Hub
                    </Link>
                  )}

                  {isRepair && (
                    <Link
                      to="/repairs"
                      className="w-full py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                    >
                      Check Workshop Status
                    </Link>
                  )}

                  {isFullReuse && (
                    <button
                      onClick={handleApplyAllReusable}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                    >
                      Lock In Allocation
                    </button>
                  )}

                  {isPurchase && (
                    <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs text-center">
                      Procure Shortage of {rec.remainingShortage} Units Only
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
