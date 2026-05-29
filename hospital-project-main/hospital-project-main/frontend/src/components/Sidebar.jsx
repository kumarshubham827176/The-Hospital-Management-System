import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/doctors', label: 'Doctors & Staff' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/prescriptions', label: 'Prescriptions' },
  { to: '/billing', label: 'Billing' },
  { to: '/reports', label: 'Reports' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 border-r border-white/10 bg-slate-950/95 px-5 py-6 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 text-sm font-black text-white shadow-glass">
              HMS
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Cloud Hospital</h2>
              <p className="text-sm text-slate-400">{user?.role || 'Admin'} Console</p>
            </div>
          </div>

          <button className="dashboard-button-secondary lg:hidden" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Today</p>
          <p className="mt-2 text-2xl font-semibold text-white">14 appointments</p>
          <p className="mt-1 text-sm text-slate-400">3 urgent cases pending review</p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'border-brand-400/30 bg-brand-400/10 text-white shadow-glass'
                    : 'border-transparent bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span>{link.label}</span>
              <span className="text-xs text-slate-500">→</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {mobileOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-20 bg-slate-950/70 lg:hidden"
          onClick={onClose}
        />
      ) : null}
    </>
  );
};

export default Sidebar;
