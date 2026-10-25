import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { departments, registerUser, backendStatus } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept_admin');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await registerUser({
      fullName,
      email,
      password,
      departmentId,
      role: role === 'ADMIN' ? 'CENTRAL_ADMIN' : role === 'ITEM_COORDINATOR' ? 'DEPT_COORDINATOR' : 'STUDENT_ORGANIZER',
    });

    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please check inputs.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFE] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-10 -left-20 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 relative z-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-fuchsia-500/20">
            <Sparkles className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="font-black text-3xl tracking-tight text-slate-900">Loopify</span>
        </Link>
        <p className="text-xs text-slate-500 font-medium">Create your campus verified reuse account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-violet-100 shadow-md shadow-violet-500/5 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Campus Email</label>
              <input
                type="email"
                required
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Department / Council</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800 bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800 bg-white"
              >
                <option value="STUDENT">Student / General Attendee</option>
                <option value="ORGANIZER">Student Activity / Fest Organizer</option>
                <option value="ITEM_COORDINATOR">Department Store Coordinator</option>
                <option value="ADMIN">Central Campus Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs transition-all shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Registering...' : 'Register Campus Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-violet-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
