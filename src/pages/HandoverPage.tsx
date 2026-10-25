import React, { useState } from 'react';
import {
  ArrowRightLeft,
  PackageCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ItemCondition } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import confetti from 'canvas-confetti';

export const HandoverPage: React.FC = () => {
  const {
    reservations,
    inventory,
    handovers,
    returns,
    recordHandover,
    recordReturn,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'checkout' | 'return' | 'history'>('checkout');

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutRecipient, setCheckoutRecipient] = useState('');
  const [checkoutCondition, setCheckoutCondition] = useState<ItemCondition>('GOOD');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  // Return Modal State
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedHandoverId, setSelectedHandoverId] = useState<string | null>(null);
  const [returnQty, setReturnQty] = useState(1);
  const [returnCondition, setReturnCondition] = useState<ItemCondition>('GOOD');
  const [returnNotes, setReturnNotes] = useState('');
  const [requiresInspection, setRequiresInspection] = useState(false);

  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Reservations ready for checkout: status APPROVED
  const approvedReservations = reservations.filter((r) => r.status === 'APPROVED');

  // Active checked out items: handovers that have not been fully returned
  const activeHandovers = handovers.filter((h) => {
    const returnedCount = returns
      .filter((r) => r.handoverId === h.id)
      .reduce((sum, r) => sum + r.quantityReturned, 0);
    return returnedCount < h.quantityHandedOver;
  });

  const handleOpenCheckout = (resId: string, itemId: string, maxQty: number, requester: string) => {
    setSelectedResId(resId);
    setSelectedItemId(itemId);
    setCheckoutQty(maxQty);
    setCheckoutRecipient(requester);
    setCheckoutCondition('GOOD');
    setCheckoutNotes('All clamps and hardware inspected prior to release.');
    setCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !selectedItemId) return;

    const res = reservations.find((r) => r.id === selectedResId);
    const item = inventory.find((i) => i.id === selectedItemId);

    recordHandover({
      reservationId: selectedResId,
      eventId: res?.eventId || '',
      eventName: res?.eventName || 'Campus Event',
      inventoryItemId: selectedItemId,
      inventoryItemName: item?.name || 'Material Item',
      quantityHandedOver: Number(checkoutQty),
      releasedByUserId: currentUser.id,
      releasedByUserName: currentUser.fullName,
      receivedByUserId: res?.requesterId || 'usr-1',
      receivedByUserName: checkoutRecipient || res?.requesterName || 'Organizer',
      initialCondition: checkoutCondition,
      notes: checkoutNotes,
    });

    setCheckoutModalOpen(false);
    setFeedbackBanner('Physical checkout verified. Items are now marked as In-Use.');
    setTimeout(() => setFeedbackBanner(null), 3500);
  };

  const handleOpenReturn = (handoverId: string, maxQty: number) => {
    setSelectedHandoverId(handoverId);
    setReturnQty(maxQty);
    setReturnCondition('GOOD');
    setReturnNotes('Inspected upon return. Material clean and undamaged.');
    setRequiresInspection(false);
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHandoverId) return;

    const handover = handovers.find((h) => h.id === selectedHandoverId);
    if (!handover) return;

    const isFull = Number(returnQty) >= handover.quantityHandedOver;

    recordReturn({
      handoverId: selectedHandoverId,
      reservationId: handover.reservationId,
      inventoryItemId: handover.inventoryItemId,
      inventoryItemName: handover.inventoryItemName,
      quantityReturned: Number(returnQty),
      receivedByUserId: currentUser.id,
      receivedByUserName: currentUser.fullName,
      returnedByUserId: handover.receivedByUserId,
      returnedByUserName: handover.receivedByUserName,
      returnCondition,
      isCompleteReturn: isFull,
      notes: returnNotes,
      requiresInspection: requiresInspection || returnCondition === 'DAMAGED_REPAIRABLE',
    });

    confetti({ particleCount: 50, spread: 50 });
    setReturnModalOpen(false);
    setFeedbackBanner('Return verified! Completed reuse cycle recorded in Reuse Passport.');
    setTimeout(() => setFeedbackBanner(null), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Physical Custody Handover & Verified Return
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Record physical material release and verify post-event returns. A reservation only becomes a completed reuse once verified upon return.
        </p>
      </div>

      {feedbackBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('checkout')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'checkout'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>Approved Reservations Ready for Checkout</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/40 text-emerald-200 font-mono">
            {approvedReservations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('return')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'return'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Active Borrowed Items Awaiting Return</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950/40 text-emerald-200 font-mono">
            {activeHandovers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Audit Log History</span>
        </button>
      </div>

      {/* TAB 1: Approved Reservations Ready for Checkout */}
      {activeTab === 'checkout' && (
        <div className="space-y-4">
          {approvedReservations.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              title="No Reservations Pending Checkout"
              description="There are currently no approved reservations awaiting physical material handover."
            />
          ) : (
            approvedReservations.map((res) => (
              <div
                key={res.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{res.eventName}</h3>
                      <StatusBadge status={res.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Approved for <strong>{res.requesterName}</strong> &bull; {res.requesterDepartment}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Event Dates: {res.startDate} to {res.endDate}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Items Authorized for Physical Issue
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {res.items.map((line) => (
                      <div
                        key={line.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{line.inventoryItemName}</p>
                          <span className="text-[11px] text-emerald-800 font-mono font-bold">
                            Allocated: {line.quantityAllocated} units
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            handleOpenCheckout(res.id, line.inventoryItemId, line.quantityAllocated, res.requesterName)
                          }
                          className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-2xs"
                        >
                          Verify Handover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Active Borrowed Items Awaiting Return */}
      {activeTab === 'return' && (
        <div className="space-y-4">
          {activeHandovers.length === 0 ? (
            <EmptyState
              icon={RotateCcw}
              title="All Borrowed Materials Returned"
              description="No outstanding items are currently checked out across campus."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeHandovers.map((h) => {
                const returnedCount = returns
                  .filter((r) => r.handoverId === h.id)
                  .reduce((sum, r) => sum + r.quantityReturned, 0);
                const outstandingQty = h.quantityHandedOver - returnedCount;

                return (
                  <div
                    key={h.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                          In Use: {h.quantityHandedOver} units
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Checked out: {new Date(h.handoverDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{h.inventoryItemName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Event: {h.eventName}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <p className="text-slate-600">
                          Custodian: <strong>{h.receivedByUserName}</strong>
                        </p>
                        <p className="text-slate-600">
                          Released by: <strong>{h.releasedByUserName}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Initial Condition: {h.initialCondition}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenReturn(h.id, outstandingQty)}
                      className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Verify Return of {outstandingQty} Units</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Verified Completed Returns (Completed Reuses)</h3>
          <p className="text-xs text-slate-500">
            These records serve as the verified evidence for campus reuse metrics and avoided purchases.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {returns.map((ret) => (
              <div key={ret.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800">{ret.inventoryItemName}</p>
                  <p className="text-[11px] text-slate-400">
                    Returned by {ret.returnedByUserName} &bull; Received by {ret.receivedByUserName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +{ret.quantityReturned} units verified
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {new Date(ret.returnDate).toLocaleDateString()} &bull; Condition: {ret.returnCondition}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Verify Material Handover"
        subtitle="Confirm physical item custody transfer to event organizer"
      >
        <form onSubmit={handleConfirmCheckout} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Quantity Handed Over</label>
            <input
              type="number"
              min={1}
              required
              value={checkoutQty}
              onChange={(e) => setCheckoutQty(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Receiving Organizer Name</label>
            <input
              type="text"
              required
              value={checkoutRecipient}
              onChange={(e) => setCheckoutRecipient(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Condition at Handover</label>
            <select
              value={checkoutCondition}
              onChange={(e) => setCheckoutCondition(e.target.value as ItemCondition)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="EXCELLENT">Excellent (Like New)</option>
              <option value="GOOD">Good (Ready for Use)</option>
              <option value="MINOR_WEAR">Minor Scuffs / Wear</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Verification Notes</label>
            <textarea
              rows={2}
              value={checkoutNotes}
              onChange={(e) => setCheckoutNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
            >
              Confirm Checkout Handover
            </button>
          </div>
        </form>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Verify Material Return"
        subtitle="Confirm physical return, check condition, and log completed reuse"
      >
        <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Returned Quantity</label>
            <input
              type="number"
              min={1}
              required
              value={returnQty}
              onChange={(e) => setReturnQty(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Returned Condition</label>
            <select
              value={returnCondition}
              onChange={(e) => {
                const val = e.target.value as ItemCondition;
                setReturnCondition(val);
                if (val === 'DAMAGED_REPAIRABLE' || val === 'UNUSABLE') {
                  setRequiresInspection(true);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="EXCELLENT">Excellent (Flawless)</option>
              <option value="GOOD">Good (Ready for Next Use)</option>
              <option value="MINOR_WEAR">Minor Wear</option>
              <option value="DAMAGED_REPAIRABLE">Damaged (Needs Repair)</option>
              <option value="UNUSABLE">Unusable / Broken</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <input
              type="checkbox"
              id="reqInsp"
              checked={requiresInspection}
              onChange={(e) => setRequiresInspection(e.target.checked)}
              className="w-4 h-4 text-emerald-800 rounded-sm"
            />
            <label htmlFor="reqInsp" className="text-amber-900 font-semibold cursor-pointer">
              Route to Inspection Pending (Requires Coordinator Sign-Off before restocking)
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Return Notes</label>
            <textarea
              rows={2}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReturnModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold"
            >
              Confirm Verified Return
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
