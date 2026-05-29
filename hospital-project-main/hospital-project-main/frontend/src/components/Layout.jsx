import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dashboard text-slate-100 lg:flex">
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              className="dashboard-button-secondary lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              Menu
            </button>

            <div className="min-w-0">
              <p className="dashboard-label">Cloud-Based Hospital Management</p>
              <h1 className="mt-1 truncate text-xl font-semibold text-white md:text-2xl">
                Welcome back, {user?.name || 'User'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="dashboard-chip">{user?.role || 'Guest'}</span>
              <button className="dashboard-button-secondary" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
