import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle2, PackagePlus, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemCondition } from '../types';

export const InventoryCreatePage: React.FC = () => {
  const { categories, departments, addInventoryItem, currentUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [departmentId, setDepartmentId] = useState(currentUser.departmentId || departments[0]?.id || '');
  const [storageLocation, setStorageLocation] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [condition, setCondition] = useState<ItemCondition>('GOOD');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !storageLocation.trim() || quantity <= 0) return;

    const catObj = categories.find((c) => c.id === categoryId);
    const deptObj = departments.find((d) => d.id === departmentId);

    const newItem = addInventoryItem({
      name: name.trim(),
      description: description.trim(),
      categoryId,
      categoryName: catObj?.name || 'General Event Material',
      departmentId,
      departmentName: deptObj?.name || 'Campus Central Store',
      storageLocation: storageLocation.trim(),
      totalQuantity: Number(quantity),
      usableQuantity: Number(quantity),
      reservedQuantity: 0,
      borrowedQuantity: 0,
      inspectionPendingQuantity: 0,
      underRepairQuantity: 0,
      condition,
      status: 'AVAILABLE',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    });

    setSuccessMsg(`"${newItem.name}" successfully registered with QR Token ${newItem.qrCodeToken}!`);
    setTimeout(() => {
      navigate('/inventory');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
      <Link
        to="/inventory"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Inventory</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <PackagePlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Register Reusable Campus Material
              </h2>
              <p className="text-xs text-slate-500">
                Log existing or post-event resources into the centralized campus catalog to prevent duplicate purchases.
              </p>
            </div>
          </div>
        </div>

        {successMsg ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900">Registration Complete</h3>
            <p className="text-xs text-emerald-700">{successMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Material Name */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Material Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6x3ft Telescopic Aluminum Banner Stand"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Description & Specifications</label>
              <textarea
                rows={3}
                placeholder="Detail dimensions, material composition, included clamps, carrying bags, and handling guidelines..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            {/* Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Owning Department / Custody <span className="text-rose-600">*</span>
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity, Condition & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Quantity Acquired/Recorded <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  <option value="EXCELLENT">Excellent (Like New)</option>
                  <option value="GOOD">Good (Usable)</option>
                  <option value="MINOR_WEAR">Minor Wear</option>
                  <option value="DAMAGED_REPAIRABLE">Damaged (Repairable)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Storage Location <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rack C-04, Hall B"
                  value={storageLocation}
                  onChange={(e) => setStorageLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>
            </div>

            {/* Photo Image URL */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Photo Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Optional. Leave blank to assign standard category presentation placeholder.
              </p>
            </div>

            {/* Form actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/inventory"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Register & Generate QR Passport</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
