import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAF7] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-[#123B2A] shadow-2xl z-50 transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenMobile={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
