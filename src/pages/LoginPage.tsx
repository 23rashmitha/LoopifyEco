import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, UserCheck, ArrowRight, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { users, switchUser, loginUser, backendStatus } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@loopify.edu');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickLogin = async (userId: string, presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    switchUser(userId);
    navigate('/dashboard');
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
        <p className="text-xs text-slate-500 font-medium">
          Sign in to your campus verified reuse portal
        </p>

        {/* Backend live indicator pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border bg-white shadow-2xs">
          <span className={`w-2 h-2 rounded-full ${backendStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-slate-600">
            {backendStatus.isConnected ? 'Spring Boot 3.3.4 (Port 8080) Live' : 'Standalone Mode (Spring Boot Offline)'}
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-violet-100 shadow-md shadow-violet-500/5 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Campus Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800"
                placeholder="name@loopify.edu"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-800"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs transition-all shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In with JWT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Pre-seeded Roles */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black text-violet-800 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-violet-600" />
                <span>Pre-Seeded Roles</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Passwords: admin123, etc.</span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('usr-1', 'admin@loopify.edu', 'admin123')}
                className="w-full p-2.5 rounded-2xl border border-purple-200 hover:border-violet-400 hover:bg-violet-50/50 flex items-center justify-between transition-all text-left group"
              >
                <div>
                  <p className="font-extrabold text-slate-800 leading-tight group-hover:text-violet-900">Dr. Robert Vance (Central Admin)</p>
                  <p className="text-[10px] text-slate-400">admin@loopify.edu &bull; Pass: admin123</p>
                </div>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-100 group-hover:bg-violet-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                  Login &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('usr-2', 'coordinator@loopify.edu', 'coord123')}
                className="w-full p-2.5 rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center justify-between transition-all text-left group"
              >
                <div>
                  <p className="font-extrabold text-slate-800 leading-tight group-hover:text-emerald-900">Sarah Jenkins (Department Coordinator)</p>
                  <p className="text-[10px] text-slate-400">coordinator@loopify.edu &bull; Pass: coord123</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                  Login &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('usr-3', 'organizer@loopify.edu', 'student123')}
                className="w-full p-2.5 rounded-2xl border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between transition-all text-left group"
              >
                <div>
                  <p className="font-extrabold text-slate-800 leading-tight group-hover:text-blue-900">Alex Chen (Student Fest Organizer)</p>
                  <p className="text-[10px] text-slate-400">organizer@loopify.edu &bull; Pass: student123</p>
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                  Login &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-violet-700 hover:underline">
            Register for Campus Access
          </Link>
        </p>
      </div>
    </div>
  );
};
