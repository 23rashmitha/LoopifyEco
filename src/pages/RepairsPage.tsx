import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const RepairsPage: React.FC = () => {
  const { repairs, updateRepairRecord, inventory } = useApp();

  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'REPORTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('IN_PROGRESS');
  const [repairNotes, setRepairNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const activeRepairs = repairs.filter((r) => r.status === 'REPORTED' || r.status === 'IN_PROGRESS');
  const completedRepairs = repairs.filter((r) => r.status === 'COMPLETED');

  const handleOpenUpdate = (repairId: string) => {
    setSelectedRepairId(repairId);
    const r = repairs.find((rep) => rep.id === repairId);
    setNewStatus(r?.status || 'IN_PROGRESS');
    setRepairNotes(r?.notes || '');
    setUpdateModalOpen(true);
  };

  const handleConfirmUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepairId) return;

    updateRepairRecord(selectedRepairId, {
      status: newStatus,
      notes: repairNotes,
      completedDate: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    });

    setUpdateModalOpen(false);
    setFeedbackMsg(
      newStatus === 'COMPLETED'
        ? 'Repair marked as COMPLETED. Crucial rule: Stock requires post-repair inspection in the Inspection Hub before being marked usable.'
        : 'Repair status updated.'
    );
    setTimeout(() => setFeedbackMsg(''), 4500);
  };

  const selectedRepair = repairs.find((r) => r.id === selectedRepairId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Campus Workshop Repair Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Repair what can be saved. Tracking damaged campus event assets through workshop triage and restoration.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Active Repair Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-600" />
            <span>Active Maintenance Queue ({activeRepairs.length} Cases)</span>
          </h3>
          <span className="text-xs text-slate-400">Mechanical & Electrical Workshop</span>
        </div>

        {activeRepairs.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Zero Outstanding Repairs"
            description="All campus materials in repair have been restored and returned to circulation."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRepairs.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rep.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Reported: {new Date(rep.reportedDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{rep.inventoryItemName}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.damageDescription}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Assigned Team:</span>
                      <strong className="text-slate-800">{rep.assignedTo}</strong>
                    </div>
                    {rep.repairCost && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Estimated Repair Cost:</span>
                        <strong className="text-emerald-800 font-mono">${rep.repairCost.toFixed(2)}</strong>
                      </div>
                    )}
                    {rep.notes && (
                      <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        Work notes: {rep.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenUpdate(rep.id)}
                  className="w-full py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Update Repair Status</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Repairs History */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Completed Restorations & Saved Material Value</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {completedRepairs.map((rep) => (
            <div key={rep.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900">{rep.inventoryItemName}</p>
                <p className="text-slate-500">{rep.damageDescription}</p>
                <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">
                  Completed on {rep.completedDate ? new Date(rep.completedDate).toLocaleDateString() : 'Recent'} &bull; Restored by {rep.assignedTo}
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-slate-900">
                  Cost: ${rep.repairCost?.toFixed(2) || '0.00'}
                </span>
                <span className="block text-[10px] text-emerald-700">Kept out of landfill</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Repair Modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Update Repair Status"
        subtitle="Manage workshop stage & log technician notes"
      >
        {selectedRepair && (
          <form onSubmit={handleConfirmUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Repair Stage</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="REPORTED">Reported (Awaiting Diagnostics)</option>
                <option value="IN_PROGRESS">In Progress (Parts / Machining Active)</option>
                <option value="COMPLETED">Completed (Requires Post-Repair Inspection)</option>
                <option value="CANCELLED">Decommissioned / Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Technician Notes</label>
              <textarea
                rows={3}
                required
                value={repairNotes}
                onChange={(e) => setRepairNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setUpdateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold"
              >
                Save Status
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
