import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  Ban,
  PackageCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ItemCondition, ItemLifecycleStatus, ReservationStatus } from '../../types';

interface StatusBadgeProps {
  status: ItemLifecycleStatus | ItemCondition | ReservationStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    // Inventory statuses
    case 'AVAILABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Available</span>
        </span>
      );
    case 'RESERVED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Reserved</span>
        </span>
      );
    case 'BORROWED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-purple-50 text-purple-800 border border-purple-200 ${sizeClasses}`}>
          <PackageCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>In Use (Checked Out)</span>
        </span>
      );
    case 'INSPECTION_PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Inspection Pending</span>
        </span>
      );
    case 'UNDER_REPAIR':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}>
          <Wrench className="w-3.5 h-3.5 text-rose-600" />
          <span>Under Repair</span>
        </span>
      );
    case 'RETIRED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5 text-slate-500" />
          <span>Retired / Recycled</span>
        </span>
      );

    // Condition statuses
    case 'EXCELLENT':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Excellent Condition</span>
        </span>
      );
    case 'GOOD':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses}`}>
          <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
          <span>Good (Ready)</span>
        </span>
      );
    case 'MINOR_WEAR':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Minor Wear</span>
        </span>
      );
    case 'DAMAGED_REPAIRABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}>
          <Wrench className="w-3.5 h-3.5 text-rose-600" />
          <span>Damaged (Repairable)</span>
        </span>
      );
    case 'UNUSABLE':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-red-100 text-red-900 border border-red-300 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-red-700" />
          <span>Unusable</span>
        </span>
      );

    // Reservation statuses
    case 'APPROVED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Pending Review</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    case 'FULFILLED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}>
          <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Fulfilled & Returned</span>
        </span>
      );
    case 'CANCELLED':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5 text-slate-500" />
          <span>Cancelled</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 ${sizeClasses}`}>
          <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
          <span>{status}</span>
        </span>
      );
  }
};
