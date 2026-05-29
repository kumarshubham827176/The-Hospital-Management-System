import React, { useEffect, useState } from 'react';
import client from '../api/client';

const emptyForm = { doctor: '', patient: '', notes: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] };

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const { data } = await client.get('/prescriptions');
    setPrescriptions(data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await client.post('/prescriptions', form);
    setForm(emptyForm);
    load();
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header"><h2>Generate Prescription</h2></div>
        <form className="form-grid" onSubmit={submit}>
          <input placeholder="doctor" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
          <input placeholder="patient" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} />
          <input placeholder="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn btn-primary" type="submit">Save Prescription</button>
        </form>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Prescriptions</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Medicines</th><th>Notes</th></tr></thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p._id}>
                  <td>{p.patient?.user?.name || p.patient}</td>
                  <td>{p.doctor?.user?.name || p.doctor}</td>
                  <td>{p.medicines?.length || 0}</td>
                  <td>{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PrescriptionsPage;
