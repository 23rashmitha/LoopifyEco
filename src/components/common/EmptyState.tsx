import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 my-4">
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
