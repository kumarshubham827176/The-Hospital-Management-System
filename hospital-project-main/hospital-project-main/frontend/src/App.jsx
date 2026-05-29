import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { FaBars, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import LoginPage from './pages/LoginPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import BillingPage from './pages/BillingPage';
import ReportsPage from './pages/ReportsPage';

const AppLayout = () => {
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_left_center,_rgba(14,165,233,0.1),transparent_24%),radial-gradient(circle_at_right_bottom,_rgba(45,212,191,0.08),transparent_26%),linear-gradient(180deg,#020617,#0b1220)]">
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <FaBars />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Hospital Management</p>
                <h1 className="truncate text-lg font-semibold text-white md:text-xl">Welcome, {user?.name || 'User'}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 md:inline-flex">
                {user?.role || 'User'}
              </span>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10">
                <FaBell />
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
