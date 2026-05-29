import { NavLink } from 'react-router-dom';
import {
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyCheckAlt,
  FaNotesMedical,
  FaTimes,
  FaTachometerAlt,
  FaUserInjured,
  FaUserMd,
} from 'react-icons/fa';

const links = [
  { to: '/', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/patients', label: 'Patients', icon: FaUserInjured },
  { to: '/doctors', label: 'Doctors', icon: FaUserMd },
  { to: '/appointments', label: 'Appointments', icon: FaCalendarCheck },
  { to: '/prescriptions', label: 'Prescriptions', icon: FaNotesMedical },
  { to: '/billing', label: 'Billing', icon: FaMoneyCheckAlt },
  { to: '/reports', label: 'Reports', icon: FaClipboardList },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg">
              HMS
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Cloud Hospital</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 lg:hidden"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Today</p>
          <p className="mt-2 text-2xl font-semibold text-white">14 Appointments</p>
          <p className="mt-1 text-xs text-slate-400">3 high-priority follow-ups pending</p>
        </div>

        <ul className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? 'border-cyan-300/50 bg-cyan-400/15 text-white shadow-[0_8px_24px_rgba(34,211,238,0.18)]'
                        : 'border-transparent text-slate-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/7 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="text-base text-cyan-300 transition-transform duration-200 group-hover:scale-110" />
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500 transition group-hover:text-slate-300">→</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </aside>

      {mobileOpen ? <button className="fixed inset-0 z-20 bg-slate-950/70 lg:hidden" onClick={onClose} /> : null}
    </>
  );
}
