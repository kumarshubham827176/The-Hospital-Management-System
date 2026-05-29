import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaUserMd } from 'react-icons/fa';
import toast from 'react-hot-toast';
import client from '../api/client';

const emptyForm = { name: '', email: '', password: '', specialization: '', department: '', licenseNumber: '' };

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/doctors');
      setDoctors(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load().catch(console.error); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        await client.put(`/doctors/${editingId}`, {
          specialization: form.specialization,
          department: form.department,
          licenseNumber: form.licenseNumber,
        });
        toast.success('Doctor profile updated');
      } else {
        await client.post('/doctors', form);
        toast.success('Doctor added successfully');
      }

      resetForm();
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save doctor');
    } finally {
      setSubmitting(false);
    }
  };

  const removeDoctor = async (id) => {
    if (!window.confirm('Delete this doctor profile?')) return;

    try {
      await client.delete(`/doctors/${id}`);
      toast.success('Doctor deleted');
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete doctor');
    }
  };

  const editDoctor = (doctor) => {
    setEditingId(doctor._id);
    setForm({
      name: doctor.user?.name || '',
      email: doctor.user?.email || '',
      password: '',
      specialization: doctor.specialization || '',
      department: doctor.department || '',
      licenseNumber: doctor.licenseNumber || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalDoctors = doctors.length;
  const totalDepartments = new Set(doctors.map((doctor) => doctor.department).filter(Boolean)).size;
  const averageFee = totalDoctors
    ? Math.round(
        doctors.reduce((sum, doctor) => sum + Number(doctor.consultationFee || 0), 0) /
          totalDoctors
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.28)] transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Doctors</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalDoctors}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.28)] transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Departments</p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalDepartments}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.28)] transition hover:-translate-y-0.5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Avg Consultation Fee</p>
          <p className="mt-2 text-3xl font-semibold text-white">${averageFee}</p>
        </div>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.32)] backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Doctor' : 'Add Doctor'}</h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Name</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Enter doctor name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={Boolean(editingId)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={Boolean(editingId)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder={editingId ? 'Not editable in update mode' : 'Minimum 6 characters'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={Boolean(editingId)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Specialization</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="e.g. Cardiology"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Department</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="e.g. Emergency"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">License Number</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Medical license no."
              value={form.licenseNumber}
              onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:from-cyan-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingId ? 'Update Doctor' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.32)] backdrop-blur-md">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Doctor Profiles</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            {doctors.length} records
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Doctor</th>
                <th className="px-4 py-3 text-left font-medium">Specialization</th>
                <th className="px-4 py-3 text-left font-medium">Department</th>
                <th className="px-4 py-3 text-left font-medium">License</th>
                <th className="px-4 py-3 text-left font-medium">Fee</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading doctors...</td>
                </tr>
              ) : doctors.length ? (
                doctors.map((doctor) => (
                  <tr key={doctor._id} className="border-t border-white/10 text-slate-200 transition hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
                          <FaUserMd />
                        </div>
                        <div>
                          <p className="font-medium text-white">{doctor.user?.name || 'N/A'}</p>
                          <p className="text-xs text-slate-400">{doctor.user?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{doctor.specialization || 'N/A'}</td>
                    <td className="px-4 py-3">{doctor.department || 'N/A'}</td>
                    <td className="px-4 py-3">{doctor.licenseNumber || 'N/A'}</td>
                    <td className="px-4 py-3">${doctor.consultationFee || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editDoctor(doctor)}
                          className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-2.5 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-500/20"
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDoctor(doctor._id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-500/10 px-2.5 py-1.5 text-xs text-rose-200 transition hover:bg-rose-500/20"
                        >
                          <FaTrash size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No doctor profiles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;
