import React, { useEffect, useState } from 'react';
import client from '../api/client';

const ReportsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/analytics/dashboard').then(({ data }) => setStats(data)).catch(console.error);
  }, []);

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header"><h2>Analytics Summary</h2></div>
        <div className="report-grid">
          <div className="report-box"><span>Patients</span><strong>{stats?.patients ?? '—'}</strong></div>
          <div className="report-box"><span>Appointments</span><strong>{stats?.appointments ?? '—'}</strong></div>
          <div className="report-box"><span>Revenue</span><strong>${stats?.revenue ?? '—'}</strong></div>
        </div>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Deployment Checklist</h2></div>
        <ul className="checklist">
          <li>Deploy backend to AWS Elastic Beanstalk, Azure App Service, or Cloud Run.</li>
          <li>Use MongoDB Atlas for cloud-hosted database.</li>
          <li>Store secrets in cloud environment variables or secret manager.</li>
          <li>Enable HTTPS, CORS allowlist, rate limiting, and JWT auth.</li>
          <li>Build the frontend and host on Vercel, Netlify, or Cloud Storage CDN.</li>
        </ul>
      </section>
    </div>
  );
};

export default ReportsPage;
