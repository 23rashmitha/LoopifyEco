import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  QrCode,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  CalendarPlus,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const InventoryPage: React.FC = () => {
  const { inventory, categories, departments, events, createReservation, currentUser } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedCondition, setSelectedCondition] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Quick Reserve Modal State
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [itemToReserve, setItemToReserve] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [reserveQuantity, setReserveQuantity] = useState(1);
  const [reserveSuccessMsg, setReserveSuccessMsg] = useState('');

  // Filtering
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qrCodeToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || item.categoryId === selectedCategory;
    const matchesDept = selectedDepartment === 'ALL' || item.departmentId === selectedDepartment;
    const matchesCondition = selectedCondition === 'ALL' || item.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesDept && matchesCondition;
  });

  const handleOpenReserve = (itemId: string) => {
    setItemToReserve(itemId);
    setReserveQuantity(1);
    setReserveSuccessMsg('');
    setReserveModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToReserve || !selectedEventId) return;

    createReservation(selectedEventId, [
      { inventoryItemId: itemToReserve, quantity: Number(reserveQuantity) },
    ]);

    setReserveSuccessMsg('Reservation request submitted successfully for coordinator review!');
    setTimeout(() => {
      setReserveModalOpen(false);
      navigate('/reservations');
    }, 1200);
  };

  const selectedItemObj = inventory.find((i) => i.id === itemToReserve);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Centralized Reusable Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified material catalog shared across academic departments, student council & workshop stores.
          </p>
        </div>

        <Link
          to="/inventory/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Register Material</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by material name, location, QR token (e.g. RLP-DISP-001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 self-end md:self-auto bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-700"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-700"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name.split('&')[0]}
              </option>
            ))}
          </select>

          {/* Condition */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-700"
          >
            <option value="ALL">All Conditions</option>
            <option value="EXCELLENT">Excellent</option>
            <option value="GOOD">Good (Ready)</option>
            <option value="MINOR_WEAR">Minor Wear</option>
            <option value="DAMAGED_REPAIRABLE">Damaged (Repairable)</option>
          </select>

          {(searchTerm || selectedCategory !== 'ALL' || selectedDepartment !== 'ALL' || selectedCondition !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedDepartment('ALL');
                setSelectedCondition('ALL');
              }}
              className="text-xs text-rose-700 hover:text-rose-900 font-medium underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Item List / Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Matching Materials Found"
          description="Try adjusting your search query, department filter, or condition options."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('ALL');
            setSelectedDepartment('ALL');
            setSelectedCondition('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <StatusBadge status={item.status} size="sm" />
                    <StatusBadge status={item.condition} size="sm" />
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Link
                      to={`/passport?token=${item.qrCodeToken}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-bold hover:bg-black transition-colors"
                      title="Open QR Reuse Passport"
                    >
                      <QrCode className="w-3.5 h-3.5 text-lime-400" />
                      <span>{item.qrCodeToken}</span>
                    </Link>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      {item.categoryName}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug mt-0.5 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.storageLocation}</span>
                    </div>
                  </div>

                  {/* Stock Metrics Pills */}
                  <div className="grid grid-cols-4 gap-1.5 py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold block">Total</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">{item.totalQuantity}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-emerald-600 uppercase font-semibold block">Ready</span>
                      <span className="text-xs font-bold text-emerald-800 font-mono">{item.usableQuantity}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-blue-600 uppercase font-semibold block">Reserved</span>
                      <span className="text-xs font-bold text-blue-800 font-mono">{item.reservedQuantity}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-amber-600 uppercase font-semibold block">Pending</span>
                      <span className="text-xs font-bold text-amber-800 font-mono">{item.inspectionPendingQuantity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 flex items-center gap-2">
                <Link
                  to={`/passport?token=${item.qrCodeToken}`}
                  className="flex-1 py-2 px-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Reuse Passport
                </Link>

                <button
                  disabled={item.usableQuantity <= 0}
                  onClick={() => handleOpenReserve(item.id)}
                  className={`flex-1 py-2 px-3 text-center rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    item.usableQuantity > 0
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>{item.usableQuantity > 0 ? 'Request' : 'No Stock'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Material Name & QR</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owning Department</th>
                  <th className="py-3 px-4 text-center">Usable / Total</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.qrCodeToken} &bull; {item.storageLocation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.categoryName}</td>
                    <td className="py-3 px-4 text-slate-600">{item.departmentName}</td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-emerald-800 font-bold">{item.usableQuantity}</span> / {item.totalQuantity}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.condition} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/passport?token=${item.qrCodeToken}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
                          title="View Reuse Passport"
                        >
                          <QrCode className="w-4 h-4" />
                        </Link>
                        <button
                          disabled={item.usableQuantity <= 0}
                          onClick={() => handleOpenReserve(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-[11px] disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                        >
                          Request
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Reservation Request Modal */}
      <Modal
        isOpen={reserveModalOpen}
        onClose={() => setReserveModalOpen(false)}
        title="Request Reusable Material"
        subtitle={`Reserving for campus event & checking allocation availability`}
      >
        {selectedItemObj && (
          <form onSubmit={handleConfirmReservation} className="space-y-4 text-xs">
            {reserveSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-medium">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                {reserveSuccessMsg}
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Material</span>
                  <p className="text-sm font-bold text-slate-900">{selectedItemObj.name}</p>
                  <p className="text-xs text-slate-500">
                    Storage: {selectedItemObj.storageLocation} &bull; Ready in stock:{' '}
                    <strong className="text-emerald-800 font-mono">{selectedItemObj.usableQuantity} units</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Campus Event</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} ({evt.startDate} to {evt.endDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Requested Quantity (Max available: {selectedItemObj.usableQuantity})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedItemObj.usableQuantity}
                    value={reserveQuantity}
                    onChange={(e) => setReserveQuantity(Math.max(1, Number(e.target.value)))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReserveModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors shadow-xs"
                  >
                    Submit Reservation
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
};
