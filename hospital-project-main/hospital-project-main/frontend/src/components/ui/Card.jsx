import React from 'react';

const Card = ({ title, subtitle, action, className = '', children }) => {
  return (
    <section className={`glass-card p-5 md:p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title ? <h3 className="text-lg font-semibold text-white">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
};

export default Card;
