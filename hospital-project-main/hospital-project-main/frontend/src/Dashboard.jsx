import React, { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import { FaCalendarAlt, FaDollarSign, FaUserInjured } from 'react-icons/fa';
import client from './api/client';
import Card from './components/ui/Card';
import LoadingSpinner from './components/ui/LoadingSpinner';
import StatCard from './components/ui/StatCard';

const appointmentSeed = [
  { day: 'Mon', appointments: 18 },
  { day: 'Tue', appointments: 22 },
  { day: 'Wed', appointments: 15 },
  { day: 'Thu', appointments: 28 },
  { day: 'Fri', appointments: 24 },
  { day: 'Sat', appointments: 16 },
  { day: 'Sun', appointments: 12 },
];

const revenueSeed = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 26000 },
  { month: 'Apr', revenue: 30000 },
  { month: 'May', revenue: 28000 },
  { month: 'Jun', revenue: 34000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, revenue: 0, doctors: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          client.get('/analytics/dashboard'),
          client.get('/appointments'),
        ]);
        setStats(statsRes.data || {});
        setAppointments(appointmentsRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const recentAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)).slice(0, 6);
  }, [appointments]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FaCalendarAlt}
          label="Appointments"
          value={stats.appointments ?? 0}
          hint="Total scheduled"
          colorClass="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={FaDollarSign}
          label="Revenue"
          value={`$${Number(stats.revenue || 0).toLocaleString()}`}
          hint="Total paid invoices"
          colorClass="from-emerald-500 to-green-500"
        />
        <StatCard
          icon={FaUserInjured}
          label="Patients"
          value={stats.patients ?? 0}
          hint="Registered profiles"
          colorClass="from-violet-500 to-purple-500"
        />
        <StatCard
          icon={FaUserInjured}
          label="Doctors"
          value={stats.doctors ?? 0}
          hint="Active staff"
          colorClass="from-amber-500 to-orange-500"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Appointments per day" subtitle="Daily trend overview">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentSeed}>
                <defs>
                  <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.8rem' }} />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#appointmentsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue graph" subtitle="Monthly collection">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeed}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '0.8rem' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Recent appointments" subtitle="Latest booked consultations">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-3 py-3 font-medium">Patient</th>
                <th className="px-3 py-3 font-medium">Doctor</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((item) => (
                <tr key={item._id} className="border-b border-white/5 text-slate-200 hover:bg-white/5">
                  <td className="px-3 py-3">{item.patient?.user?.name || 'N/A'}</td>
                  <td className="px-3 py-3">{item.doctor?.user?.name || 'N/A'}</td>
                  <td className="px-3 py-3">{new Date(item.scheduledAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
