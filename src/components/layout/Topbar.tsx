import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Check,
  RotateCcw,
  UserCheck,
  ChevronDown,
  ExternalLink,
  Shield,
  Sparkles,
  Search,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface TopbarProps {
  onOpenMobile: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile }) => {
  const {
    currentUser,
    switchRole,
    users,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    backendStatus,
    checkBackendConnection,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Campus Reuse Dashboard';
    if (path.startsWith('/inventory/new')) return 'Register Reusable Material';
    if (path.startsWith('/inventory')) return 'Centralized Reusable Inventory';
    if (path.startsWith('/events/new')) return 'Plan Campus Event';
    if (path.includes('/readiness')) return 'Event Reuse Readiness & Decision Assistant';
    if (path.startsWith('/events')) return 'Campus Events & Material Demands';
    if (path.startsWith('/reservations')) return 'Material Reservation Management';
    if (path.startsWith('/handover')) return 'Physical Custody Handover & Returns';
    if (path.startsWith('/passport')) return 'QR Reuse Passport & Traceability';
    if (path.startsWith('/inspections')) return 'Condition Tracking & Inspection Hub';
    if (path.startsWith('/repairs')) return 'Repair Workshop & Maintenance Queue';
    if (path.startsWith('/reports')) return 'Reuse Chain & Lost-Opportunity Analytics';
    if (path.startsWith('/specs')) return 'MySQL Database & Backend Architecture Specs';
    return 'Loopify';
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo inventory, reservations, and lifecycle data to factory baseline?')) {
      resetDemoData();
      alert('Demo data successfully restored to fresh baseline.');
    }
  };

  const roleBadgeStyle = {
    ORGANIZER: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xs',
    ITEM_COORDINATOR: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xs',
    ADMIN: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xs',
    STUDENT: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs',
  }[currentUser.role];

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getPageTitle()}</span>
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-500 font-medium">
            Active: <span className="text-violet-700 font-semibold">{currentUser.fullName}</span> &bull; {currentUser.departmentName.split('&')[0]}
          </p>
        </div>
      </div>

      {/* Right controls: Backend Status, Role switcher, Notifications, Reset, Public Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend live status pill */}
        <button
          onClick={() => checkBackendConnection()}
          disabled={backendStatus.isChecking}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
            backendStatus.isConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
          title={backendStatus.isConnected ? 'Spring Boot 3.3.4 REST API active on port 8080' : 'Spring Boot is offline. Click to test connection to http://localhost:8080'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              backendStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>
            {backendStatus.isChecking
              ? 'Checking API...'
              : backendStatus.isConnected
              ? 'Spring Boot 8080 Live'
              : 'Standalone Mode (Click to Connect)'}
          </span>
        </button>

        {/* Public landing link */}
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-violet-700 hover:bg-violet-50 rounded-xl transition-colors border border-slate-200"
          title="View Public Landing Page"
        >
          <span>Public Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        {/* Reset Demo button */}
        <button
          onClick={handleResetData}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          title="Reset Demo Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors border border-slate-200"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center font-mono shadow-xs animate-bounce">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3.5 border-b border-purple-100 bg-gradient-to-r from-violet-50 to-pink-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">
                    {unreadNotifs.length} unread
                  </span>
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-violet-700 hover:text-violet-900 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          navigate(n.link);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-violet-50/50 transition-colors ${
                        !n.read ? 'bg-pink-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0 mt-1" />}
                      </div>
                      <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Role Switcher Dropdown */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-purple-200 hover:border-violet-400 bg-white hover:bg-violet-50/30 transition-all text-left shadow-xs"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-7 h-7 rounded-xl object-cover ring-2 ring-violet-500/20"
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.fullName}
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${roleBadgeStyle}`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[130px]">
                {currentUser.departmentName.split('&')[0]}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-purple-100 p-2.5 z-50 animate-in fade-in duration-150">
              <div className="p-2 border-b border-purple-100 mb-1.5">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-violet-600" />
                  <span>Switch Role Perspective</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Experience Loopify as a Student Club, Event Organizer, or Campus Admin:
                </p>
              </div>
              <div className="space-y-1.5">
                {users.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleRoleSelect(user.role)}
                      className={`w-full flex items-center justify-between p-2 rounded-2xl text-xs transition-colors ${
                        isSelected
                          ? 'bg-violet-50 text-violet-900 font-bold border border-violet-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold leading-tight">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400">{user.role} &bull; {user.departmentName.split('&')[0]}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-violet-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
