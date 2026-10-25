import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Calendar,
  AlertTriangle,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const ReservationsPage: React.FC = () => {
  const {
    reservations,
    approveReservation,
    rejectReservation,
    cancelReservation,
    currentUser,
    inventory,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedResId, setSelectedResId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredReservations = reservations.filter((r) =>
    filterStatus === 'ALL' ? true : r.status === filterStatus
  );

  const handleApprove = (reservationId: string) => {
    const result = approveReservation(reservationId);
    if (result.success) {
      setFeedbackMsg({ type: 'success', text: result.message });
    } else {
      setFeedbackMsg({ type: 'error', text: result.message });
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleOpenReject = (reservationId: string) => {
    setSelectedResId(reservationId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !rejectReason.trim()) return;

    rejectReservation(selectedResId, rejectReason.trim());
    setRejectModalOpen(false);
    setFeedbackMsg({ type: 'success', text: 'Reservation request has been rejected.' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleCancel = (reservationId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation request? Any reserved stock will be released back to the usable inventory.')) {
      cancelReservation(reservationId);
      setFeedbackMsg({ type: 'success', text: 'Reservation cancelled and stock released.' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const isAuthorizedToReview = currentUser.role === 'ITEM_COORDINATOR' || currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Material Reservation & Stock Locking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transparent reservation pipeline with double-booking prevention and stock lock verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inventory"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs"
          >
            + New Reservation
          </Link>
        </div>
      </div>

      {/* Feedback Alert Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {['ALL', 'PENDING', 'APPROVED', 'FULFILLED', 'REJECTED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === st
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st === 'ALL' ? 'All Requests' : st.replace('_', ' ')}
            {st === 'PENDING' && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-mono">
                {reservations.filter((r) => r.status === 'PENDING').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviewer Role Notice */}
      {!isAuthorizedToReview && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Currently viewing as <strong>{currentUser.role}</strong>. Approval & rejection controls are restricted to <strong>ITEM_COORDINATOR</strong> and <strong>ADMIN</strong> roles.
            </span>
          </div>
          <span className="text-[11px] underline cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Use Topbar Role Switcher to test
          </span>
        </div>
      )}

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Reservations Found"
          description={`No reservation requests found for the selected status "${filterStatus}".`}
        />
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => {
            const isPending = res.status === 'PENDING';
            const isApproved = res.status === 'APPROVED';

            return (
              <div
                key={res.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{res.id}</span>
                      <h3 className="text-base font-bold text-slate-900">{res.eventName}</h3>
                      <StatusBadge status={res.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Requested by <strong>{res.requesterName}</strong> &bull; {res.requesterDepartment}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{res.startDate} to {res.endDate}</span>
                  </div>
                </div>

                {/* Requested items lines */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Reserved Material Lines
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {res.items.map((line) => {
                      const inv = inventory.find((i) => i.id === line.inventoryItemId);
                      return (
                        <div
                          key={line.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{line.inventoryItemName}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Current stock: {inv?.usableQuantity ?? 'N/A'} ready
                            </span>
                          </div>
                          <span className="font-mono font-extrabold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            {line.quantityRequested} units
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Notes / Rejection Reason */}
                {res.decisionReason && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <strong>Review Note ({res.reviewerName || 'Coordinator'}):</strong> {res.decisionReason}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Created: {new Date(res.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && isAuthorizedToReview && (
                      <>
                        <button
                          onClick={() => handleOpenReject(res.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Lock Stock</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <Link
                        to="/handover"
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 font-bold text-xs transition-colors"
                      >
                        Proceed to Physical Handover &rarr;
                      </Link>
                    )}

                    {(isPending || isApproved) && (
                      <button
                        onClick={() => handleCancel(res.id)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Reservation Request"
        subtitle="Provide a factual reason for student organizers"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Rejection Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Reserved for university accreditation inspection on overlapping dates; substitute stands suggested."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
