/**
 * Loopify - Production Application Root
 * React 19 + Vite + React Router + AppProvider
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { InventoryCreatePage } from './pages/InventoryCreatePage';
import { EventsPage } from './pages/EventsPage';
import { EventCreatePage } from './pages/EventCreatePage';
import { EventReadinessPage } from './pages/EventReadinessPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { HandoverPage } from './pages/HandoverPage';
import { ReusePassportPage } from './pages/ReusePassportPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { RepairsPage } from './pages/RepairsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SpecsPage } from './pages/SpecsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Application Shell */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/new" element={<InventoryCreatePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/new" element={<EventCreatePage />} />
            <Route path="/events/:id/readiness" element={<EventReadinessPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/handover" element={<HandoverPage />} />
            <Route path="/passport" element={<ReusePassportPage />} />
            <Route path="/inspections" element={<InspectionsPage />} />
            <Route path="/repairs" element={<RepairsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/specs" element={<SpecsPage />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
