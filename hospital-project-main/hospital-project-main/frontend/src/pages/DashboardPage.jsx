import React, { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const roleOrder = ['Admin', 'Doctor', 'Patient'];

const roleData = {
  Admin: {
    title: 'Admin dashboard',
    subtitle: 'Track hospital performance, users, revenue, and system activity in one place.',
    stats: [
      { label: 'Patients', value: '12,480', delta: '+8.4%' },
      { label: 'Doctors', value: '312', delta: '+2.1%' },
      { label: 'Revenue', value: '$248K', delta: '+14.7%' },
      { label: 'Appointments', value: '1,864', delta: '+11.2%' },
    ],
    chartTitle: 'Revenue trend',
    chartData: [68, 72, 64, 78, 84, 90, 96],
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tableTitle: 'Recent users',
    tableHeaders: ['User', 'Role', 'Status', 'Last Active'],
    tableRows: [
      ['A. Khan', 'Doctor', 'Active', '2 min ago'],
      ['M. Patel', 'Patient', 'Active', '7 min ago'],
      ['R. Shah', 'Admin', 'Active', '12 min ago'],
      ['N. Roy', 'Patient', 'Pending', '25 min ago'],
    ],
    actions: ['Manage users', 'Assign staff shifts', 'Review reports'],
    insights: [
      ['Critical tickets', '14'],
      ['Paid invoices', '92%'],
      ['Shift coverage', '97%'],
    ],
  },
  Doctor: {
    title: 'Doctor dashboard',
    subtitle: 'Review today’s appointments, prescriptions, and patient follow-ups.',
    stats: [
      { label: 'Today’s appointments', value: '18', delta: '+4' },
      { label: 'Pending prescriptions', value: '9', delta: '+1' },
      { label: 'Follow-ups', value: '6', delta: '+3' },
      { label: 'Available slots', value: '5', delta: 'Today' },
    ],
    chartTitle: 'Appointment load',
    chartData: [40, 55, 48, 68, 74, 58, 80],
    chartLabels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
    tableTitle: 'Upcoming appointments',
    tableHeaders: ['Patient', 'Time', 'Reason', 'Status'],
    tableRows: [
      ['S. Ali', '09:30', 'Fever', 'Waiting'],
      ['R. Das', '10:15', 'Follow-up', 'Confirmed'],
      ['J. Kumar', '11:00', 'Check-up', 'Confirmed'],
      ['A. Noor', '02:00', 'Lab review', 'Waiting'],
    ],
    actions: ['Write prescription', 'Update notes', 'Open schedule'],
    insights: [
      ['Rooms ready', '12'],
      ['Lab results', '8 pending'],
      ['Urgent reviews', '3'],
    ],
  },
  Patient: {
    title: 'Patient dashboard',
    subtitle: 'Book appointments, view records, and stay on top of treatment plans.',
    stats: [
      { label: 'Upcoming visits', value: '2', delta: 'This week' },
      { label: 'Records', value: '14', delta: 'Available' },
      { label: 'Prescriptions', value: '5', delta: 'Active' },
      { label: 'Balance', value: '$180', delta: 'Due' },
    ],
    chartTitle: 'Health activity',
    chartData: [22, 28, 35, 30, 42, 38, 46],
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    tableTitle: 'Medical records',
    tableHeaders: ['Date', 'Type', 'Doctor', 'Status'],
    tableRows: [
      ['Apr 12', 'Consultation', 'Dr. Mehta', 'Completed'],
      ['Apr 08', 'Lab report', 'Pathology', 'Ready'],
      ['Apr 03', 'Prescription', 'Dr. Sen', 'Active'],
      ['Mar 27', 'X-ray', 'Radiology', 'Reviewed'],
    ],
    actions: ['Book appointment', 'View records', 'Pay bill'],
    insights: [
      ['Next visit', 'Tomorrow'],
      ['Reports', '3 new'],
      ['Medication', 'On track'],
    ],
  },
};

const StatTile = ({ label, value, delta }) => (
  <div className="dashboard-card p-5">
    <p className="metric-title">{label}</p>
    <div className="mt-3 flex items-end justify-between gap-3">
      <p className="metric-amount">{value}</p>
      <span className="dashboard-chip whitespace-nowrap text-emerald-300">{delta}</span>
    </div>
  </div>
);

const MiniBarChart = ({ title, data, labels }) => {
  const max = Math.max(...data);

  return (
    <div className="dashboard-panel">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="dashboard-label">Performance</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>
        <span className="dashboard-chip">Live preview</span>
      </div>

      <div className="grid h-72 grid-cols-7 items-end gap-3">
        {data.map((value, index) => (
          <div key={labels[index] || index} className="flex h-full flex-col items-center justify-end gap-3">
            <div className="flex h-full w-full items-end rounded-3xl bg-slate-950/40 p-2">
              <div
                className="w-full rounded-2xl bg-gradient-to-t from-brand-600 via-brand-500 to-cyan-300 shadow-glass"
                style={{ height: `${(value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataTable = ({ title, headers, rows }) => (
  <div className="dashboard-panel overflow-hidden">
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <p className="dashboard-label">Activity</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      </div>
      <span className="dashboard-chip">Responsive table</span>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-slate-400">
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="whitespace-nowrap px-4 py-4 text-slate-200">
                  {cellIndex === row.length - 1 ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {cell}
                    </span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role && roleOrder.includes(user.role) ? user.role : 'Admin');
  const [apiStats, setApiStats] = useState(null);
  const current = roleData[selectedRole];

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await client.get('/analytics/dashboard');
        setApiStats(data);
      } catch {
        setApiStats(null);
      }
    };

    load();
  }, []);

  const heroStats = useMemo(() => {
    if (selectedRole === 'Admin' && apiStats) {
      return [
        { label: 'Patients', value: Number(apiStats.patients).toLocaleString(), delta: 'Live' },
        { label: 'Doctors', value: Number(apiStats.doctors).toLocaleString(), delta: 'Live' },
        { label: 'Appointments', value: Number(apiStats.appointments).toLocaleString(), delta: 'Live' },
        { label: 'Revenue', value: `$${Number(apiStats.revenue || 0).toLocaleString()}`, delta: 'Live' },
      ];
    }

    return current.stats;
  }, [apiStats, current.stats, selectedRole]);

  return (
    <div className="space-y-6">
      <section className="dashboard-card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="dashboard-label">Role-aware dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              {current.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {current.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-slate-950/40 p-2">
            {roleOrder.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  selectedRole === role
                    ? 'bg-gradient-to-r from-brand-500 to-cyan-300 text-slate-950'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {(current.actions || []).map((action) => (
            <span key={action} className="dashboard-chip">
              {action}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {heroStats.map((item) => (
          <StatTile key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <MiniBarChart title={current.chartTitle} data={current.chartData} labels={current.chartLabels} />
        </div>

        <div className="dashboard-panel xl:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="dashboard-label">Snapshot</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Quick insights</h3>
            </div>
            <span className="dashboard-chip">Today</span>
          </div>

          <div className="space-y-4">
            {current.insights.map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/10 to-violet-500/10 p-5">
            <p className="dashboard-label">Mobile friendly</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The layout collapses into stacked cards, keeping charts and tables easy to use on tablets and phones.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <DataTable title={current.tableTitle} headers={current.tableHeaders} rows={current.tableRows} />
        </div>

        <div className="dashboard-panel xl:col-span-2">
          <div className="mb-6">
            <p className="dashboard-label">Workflow</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{selectedRole} actions</h3>
          </div>

          <div className="space-y-4">
            {selectedRole === 'Admin' && [
              ['User management', 'Create doctors, approve staff, and control access.'],
              ['Revenue tracking', 'Monitor payments and outstanding invoices.'],
              ['System activity', 'Review notifications and shift assignments.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}

            {selectedRole === 'Doctor' && [
              ['Patient care', 'Review appointments, prescriptions, and notes.'],
              ['Schedule planning', 'See the day’s workflow in a single glance.'],
              ['Clinical records', 'Access past visits and medical history.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}

            {selectedRole === 'Patient' && [
              ['Fast booking', 'Book appointments without switching screens.'],
              ['Record access', 'View lab reports and treatment history.'],
              ['Billing view', 'Keep track of balances and invoices.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
