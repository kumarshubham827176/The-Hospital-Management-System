import React from 'react';

const StatCard = ({ icon, label, value, hint, colorClass = 'from-cyan-500 to-blue-500' }) => {
  const Icon = icon;

  return (
    <div className="glass-card p-4 transition hover:-translate-y-0.5 hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
          {Icon ? <Icon size={16} /> : null}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
