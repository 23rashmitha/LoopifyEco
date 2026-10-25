import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Sparkles,
  Building,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ItemCondition, ItemLifecycleStatus } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';

export const InspectionsPage: React.FC = () => {
  const { inventory, inspections, recordInspection, currentUser } = useApp();

  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [assessedCondition, setAssessedCondition] = useState<ItemCondition>('GOOD');
  const [recommendedStatus, setRecommendedStatus] = useState<ItemLifecycleStatus>('AVAILABLE');
  const [componentsIntact, setComponentsIntact] = useState(true);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Items needing inspection: inspectionPendingQuantity > 0
  const pendingInspectionItems = inventory.filter((i) => i.inspectionPendingQuantity > 0);

  const handleOpenInspect = (itemId: string) => {
    setSelectedItemId(itemId);
    setAssessedCondition('GOOD');
    setRecommendedStatus('AVAILABLE');
    setComponentsIntact(true);
    setInspectionNotes('Physical condition verified. Connectors intact and safe for reuse.');
    setInspectModalOpen(true);
  };

  const handleConfirmInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;

    const item = inventory.find((i) => i.id === selectedItemId);

    recordInspection({
      inventoryItemId: selectedItemId,
      inventoryItemName: item?.name || 'Material Item',
      inspectorId: currentUser.id,
      inspectorName: currentUser.fullName,
      previousCondition: item?.condition || 'MINOR_WEAR',
      assessedCondition,
      recommendedStatus,
      notes: inspectionNotes,
      componentsIntact,
    });

    confetti({ particleCount: 50, spread: 60 });
    setInspectModalOpen(false);
    setFeedbackMsg(`Condition inspection signed off. Item returned to "${recommendedStatus}" stock.`);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const selectedItemObj = inventory.find((i) => i.id === selectedItemId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Condition Tracking & Inspection Hub
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Items pending inspection do not count as ready-to-use inventory until verified by an authorized coordinator.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Pending Inspection Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-600" />
            <span>Inspection Queue ({pendingInspectionItems.length} Materials Awaiting Sign-Off)</span>
          </h3>
          <span className="text-xs text-slate-400">Restores allocatable stock upon approval</span>
        </div>

        {pendingInspectionItems.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Inspection Queue Clear"
            description="All returned campus materials have completed condition verification. Zero items waiting in inspection."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingInspectionItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-amber-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      {item.inspectionPendingQuantity} Units Awaiting Inspection
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">{item.qrCodeToken}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.categoryName} &bull; {item.departmentName}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs space-y-1 text-slate-700">
                    <p>
                      <strong>Storage:</strong> {item.storageLocation}
                    </p>
                    <p>
                      <strong>Current Condition:</strong> {item.condition.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Notice: Approving these units directly fulfills event shortages in EnGenius & Conclave!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenInspect(item.id)}
                  className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Perform Condition Inspection & Sign Off</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Inspection Logs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Recent Completed Inspection Records</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {inspections.map((insp) => (
            <div key={insp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{insp.inventoryItemName}</p>
                <p className="text-slate-600 leading-normal">{insp.notes}</p>
                <span className="text-[11px] text-slate-400">
                  Inspector: <strong>{insp.inspectorName}</strong> &bull; {new Date(insp.inspectionDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={insp.assessedCondition} size="sm" />
                <StatusBadge status={insp.recommendedStatus} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspection Modal */}
      <Modal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        title="Conduct Condition Inspection"
        subtitle={`Certify condition and determine stock availability`}
      >
        {selectedItemObj && (
          <form onSubmit={handleConfirmInspection} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Item Under Inspection</span>
              <p className="text-sm font-bold text-slate-900">{selectedItemObj.name}</p>
              <p className="text-xs text-slate-500 font-mono">
                {selectedItemObj.inspectionPendingQuantity} units pending &bull; Location: {selectedItemObj.storageLocation}
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Assessed Physical Condition</label>
              <select
                value={assessedCondition}
                onChange={(e) => {
                  const val = e.target.value as ItemCondition;
                  setAssessedCondition(val);
                  if (val === 'DAMAGED_REPAIRABLE') {
                    setRecommendedStatus('UNDER_REPAIR');
                  } else if (val === 'EXCELLENT' || val === 'GOOD' || val === 'MINOR_WEAR') {
                    setRecommendedStatus('AVAILABLE');
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="EXCELLENT">Excellent (Like New)</option>
                <option value="GOOD">Good (Safe & Usable)</option>
                <option value="MINOR_WEAR">Minor Scuffs / Wear (Still Usable)</option>
                <option value="DAMAGED_REPAIRABLE">Damaged (Requires Repair)</option>
                <option value="UNUSABLE">Unusable / Retired</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Stock Destination Status</label>
              <select
                value={recommendedStatus}
                onChange={(e) => setRecommendedStatus(e.target.value as ItemLifecycleStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="AVAILABLE">Return to Available (Ready for Reservation)</option>
                <option value="UNDER_REPAIR">Transfer to Central Workshop (Under Repair)</option>
                <option value="RETIRED">Retire / Scrap</option>
              </select>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="compIntact"
                checked={componentsIntact}
                onChange={(e) => setComponentsIntact(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded-sm"
              />
              <label htmlFor="compIntact" className="text-slate-800 font-semibold cursor-pointer">
                All brackets, thumb screws, power pins, and accessories verified present
              </label>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Inspector Notes & Sign-Off</label>
              <textarea
                rows={2}
                required
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
              >
                Sign Off & Update Stock
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
