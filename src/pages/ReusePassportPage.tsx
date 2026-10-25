import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  QrCode,
  Sparkles,
  Search,
  Building,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  DollarSign,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ItemLifecycleEvent, LifecycleEventType } from '../types';

export const ReusePassportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { inventory, lifecycleEvents, categories } = useApp();

  const tokenParam = searchParams.get('token');
  const [selectedToken, setSelectedToken] = useState<string>(
    tokenParam || inventory[0]?.qrCodeToken || 'RLP-DISP-001'
  );

  useEffect(() => {
    if (tokenParam) {
      setSelectedToken(tokenParam);
    }
  }, [tokenParam]);

  const selectedItem = inventory.find((i) => i.qrCodeToken === selectedToken) || inventory[0];

  const itemEvents = lifecycleEvents.filter(
    (e) => e.inventoryItemId === selectedItem?.id
  );

  // Calculate item reuse statistics
  const verifiedReusesCount = itemEvents.filter((e) => e.eventType === 'RETURNED').length;
  const catObj = categories.find((c) => c.id === selectedItem?.categoryId);
  const replacementCost = catObj?.estimatedReplacementCost || 45;
  const avoidedSpend = verifiedReusesCount * replacementCost;

  const handleSelectToken = (token: string) => {
    setSelectedToken(token);
    setSearchParams({ token });
  };

  const getTimelineIcon = (type: LifecycleEventType) => {
    switch (type) {
      case 'REGISTERED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'RESERVATION_ALLOCATED':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'HANDED_OVER':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'RETURNED':
        return <RotateCcw className="w-4 h-4 text-emerald-600" />;
      case 'INSPECTION_COMPLETED':
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case 'DAMAGE_REPORTED':
      case 'REPAIR_STARTED':
      case 'REPAIR_VERIFIED':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-400 text-emerald-950 font-mono">
              Innovation Feature 3
            </span>
            <span className="text-xs text-slate-500 font-semibold">Immutable Lifecycle Journey</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            QR Reuse Passport & Traceability
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every registered material unit holds a verifiable digital passport tracking its physical checkouts, returns, condition inspections, and circular reuse journey.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print QR Passport</span>
        </button>
      </div>

      {/* QR Token Selector Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-emerald-800" />
          <span className="text-xs font-bold text-slate-800">Select Item Passport:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {inventory.map((inv) => (
            <button
              key={inv.id}
              onClick={() => handleSelectToken(inv.qrCodeToken)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedToken === inv.qrCodeToken
                  ? 'bg-emerald-800 text-white shadow-2xs scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {inv.qrCodeToken}
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Visual QR Passport Card */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Campus Reuse Passport
                </span>
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  VERIFIED IDENTIFIER
                </span>
              </div>

              {/* High-Contrast QR Code Visual Graphic */}
              <div className="p-6 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-md flex items-center justify-center">
                  {/* High Quality Stylized SVG QR Code */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="4" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="9" y="9" width="12" height="12" />
                    
                    <rect x="70" y="0" width="30" height="30" rx="4" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="79" y="9" width="12" height="12" />
                    
                    <rect x="0" y="70" width="30" height="30" rx="4" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="9" y="79" width="12" height="12" />

                    <rect x="40" y="10" width="15" height="10" />
                    <rect x="40" y="25" width="10" height="15" />
                    <rect x="10" y="40" width="10" height="15" />
                    <rect x="25" y="45" width="15" height="10" />
                    <rect x="45" y="45" width="20" height="20" rx="3" fill="#10B981" />
                    <rect x="70" y="40" width="10" height="25" />
                    <rect x="85" y="45" width="15" height="15" />
                    <rect x="40" y="75" width="20" height="10" />
                    <rect x="70" y="75" width="15" height="15" />
                  </svg>
                </div>
                <div className="text-white space-y-0.5">
                  <p className="text-xs font-mono font-bold tracking-widest text-lime-400">
                    {selectedItem.qrCodeToken}
                  </p>
                  <p className="text-[10px] text-slate-400">Scan on mobile to inspect custody history</p>
                </div>
              </div>

              {/* Item Info Summary */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">{selectedItem.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Category:</span>
                    <strong className="text-slate-800">{selectedItem.categoryName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Custody:</span>
                    <strong className="text-slate-800">{selectedItem.departmentName.split('&')[0]}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Storage:</span>
                    <strong className="text-slate-800">{selectedItem.storageLocation}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Condition:</span>
                    <StatusBadge status={selectedItem.condition} size="sm" />
                  </div>
                </div>
              </div>

              {/* Life metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Completed Reuses</span>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">
                    {verifiedReusesCount} cycles
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                  <span className="text-[10px] text-blue-800 uppercase font-semibold block">Avoided Purchase</span>
                  <span className="text-xl font-extrabold text-blue-950 font-mono">
                    ${avoidedSpend}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Two Columns: Chronological Journey Timeline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-800" />
                    <span>Chronological Journey & Custody Chain</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auditable timeline of registration, allocations, handovers, returns, and maintenance checks.
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  {itemEvents.length} Events Logged
                </span>
              </div>

              {itemEvents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No lifecycle events recorded for this material unit yet.
                </p>
              ) : (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {itemEvents.map((evt, idx) => (
                    <div key={evt.id} className="relative space-y-1.5 group">
                      {/* Timeline node dot */}
                      <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-800 flex items-center justify-center shadow-xs">
                        {getTimelineIcon(evt.eventType)}
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {evt.eventType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(evt.timestamp).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">{evt.eventDescription}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>
                            Actor: <strong>{evt.actorName}</strong> ({evt.actorRole})
                          </span>
                          {evt.relatedEventName && (
                            <>
                              <span>&bull;</span>
                              <span>Event: <strong>{evt.relatedEventName}</strong></span>
                            </>
                          )}
                          {evt.conditionObserved && (
                            <>
                              <span>&bull;</span>
                              <span className="text-emerald-800 font-semibold">
                                Condition: {evt.conditionObserved}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
