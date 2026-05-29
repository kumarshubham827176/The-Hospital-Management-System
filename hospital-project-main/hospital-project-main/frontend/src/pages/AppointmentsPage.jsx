import React, { useEffect, useState } from 'react';
import client from '../api/client';

const emptyForm = { patient: '', doctor: '', scheduledAt: '', reason: '' };

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await client.get('/appointments');
    setAppointments(data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/appointments', form);
    setForm(emptyForm);
    load();
  };

  const cancel = async (id) => {
    await client.post(`/appointments/${id}/cancel`, { reason: 'Cancelled from dashboard' });
    load();
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header"><h2>Book Appointment</h2></div>
        <form className="form-grid" onSubmit={submit}>
          {['patient', 'doctor', 'scheduledAt', 'reason'].map((field) => (
            <input key={field} type={field === 'scheduledAt' ? 'datetime-local' : 'text'} placeholder={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          ))}
          <button className="btn btn-primary" type="submit">Book</button>
        </form>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Appointments</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.user?.name || a.patient}</td>
                  <td>{a.doctor?.user?.name || a.doctor}</td>
                  <td>{new Date(a.scheduledAt).toLocaleString()}</td>
                  <td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td><button className="btn btn-danger" onClick={() => cancel(a._id)}>Cancel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AppointmentsPage;
