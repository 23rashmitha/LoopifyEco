import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, Plus, Trash2, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventMaterialRequirement } from '../types';

export const EventCreatePage: React.FC = () => {
  const { categories, departments, addEvent, currentUser } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-11-27');
  const [venue, setVenue] = useState('');
  const [departmentId, setDepartmentId] = useState(currentUser.departmentId || departments[0]?.id || '');

  // Dynamic requirements list
  const [requirements, setRequirements] = useState<Array<{
    categoryId: string;
    requestedQuantity: number;
    specificationNotes: string;
  }>>([
    {
      categoryId: categories[0]?.id || 'cat-disp',
      requestedQuantity: 8,
      specificationNotes: 'Poster boards for student technical paper presentation.',
    },
    {
      categoryId: categories[1]?.id || 'cat-ban',
      requestedQuantity: 3,
      specificationNotes: 'Entrance banners for keynote speakers.',
    },
  ]);

  const handleAddRequirementLine = () => {
    setRequirements((prev) => [
      ...prev,
      {
        categoryId: categories[0]?.id || '',
        requestedQuantity: 4,
        specificationNotes: '',
      },
    ]);
  };

  const handleRemoveRequirementLine = (index: number) => {
    setRequirements((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRequirementChange = (index: number, field: string, value: any) => {
    setRequirements((prev) =>
      prev.map((req, idx) => (idx === index ? { ...req, [field]: value } : req))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !venue.trim() || requirements.length === 0) return;

    const deptObj = departments.find((d) => d.id === departmentId);

    const formattedRequirements: EventMaterialRequirement[] = requirements.map((r, idx) => {
      const catObj = categories.find((c) => c.id === r.categoryId);
      return {
        id: `req-new-${Date.now()}-${idx}`,
        eventId: '',
        categoryId: r.categoryId,
        categoryName: catObj?.name || 'General Material',
        requestedQuantity: Number(r.requestedQuantity),
        specificationNotes: r.specificationNotes,
      };
    });

    const newEvent = addEvent({
      name: name.trim(),
      description: description.trim(),
      organizerId: currentUser.id,
      organizerName: currentUser.fullName,
      departmentId,
      departmentName: deptObj?.name || 'Student Affairs',
      startDate,
      endDate,
      venue: venue.trim(),
      status: 'PLANNING',
      requirements: formattedRequirements,
    });

    // Navigate straight to the readiness calculator!
    navigate(`/events/${newEvent.id}/readiness`);
  };

  const totalRequiredUnits = requirements.reduce((acc, r) => acc + Number(r.requestedQuantity || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-lime-100 text-emerald-950">
              <CalendarPlus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Plan Campus Event & Enter Material Demands
              </h2>
              <p className="text-xs text-slate-500">
                Specify event dates and required material units. The system will calculate your Event Reuse Readiness Score immediately.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Event Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Inter-Department Robotics Championship"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Event Description & Purpose</label>
              <textarea
                rows={2}
                placeholder="Briefly describe the scale, exhibition booths, audience size, and logistical setup..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Start Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                End Date <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Venue Location <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engineering Quadrangle / Main Auditorium"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Host Department / Club <span className="text-rose-600">*</span>
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

          {/* Material Demands Builder */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-800" />
                  <span>Required Material Lines</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Total required units across requirements: <strong className="font-mono text-slate-900">{totalRequiredUnits} units</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRequirementLine}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Material Line</span>
              </button>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Material Category</label>
                    <select
                      value={req.categoryId}
                      onChange={(e) => handleRequirementChange(idx, 'categoryId', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-emerald-700"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Required Qty</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={req.requestedQuantity}
                      onChange={(e) =>
                        handleRequirementChange(idx, 'requestedQuantity', Math.max(1, Number(e.target.value)))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-center focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">Specification Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Needs 50ft cords; 36x48 boards"
                      value={req.specificationNotes}
                      onChange={(e) => handleRequirementChange(idx, 'specificationNotes', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirementLine(idx)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Remove requirement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit & Next Step CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Submitting triggers real-time stock allocation checks & decision recommendations.
            </span>

            <div className="flex items-center gap-2">
              <Link
                to="/events"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs flex items-center gap-2"
              >
                <span>Save Event & Check Readiness</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
