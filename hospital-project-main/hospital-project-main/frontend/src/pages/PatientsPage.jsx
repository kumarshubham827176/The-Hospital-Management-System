import React, { useEffect, useMemo, useState } from 'react';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import client from '../api/client';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  mrn: '',
  gender: '',
  bloodGroup: '',
  address: '',
};

const PAGE_SIZE = 6;

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/patients');
      setPatients(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const validateForm = () => {
    const validationErrors = {};

    if (!form.name.trim()) validationErrors.name = 'Name is required';
    if (!form.email.trim()) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) validationErrors.email = 'Invalid email format';
    if (!editingId && form.password.length < 6) validationErrors.password = 'Password must be at least 6 characters';
    if (!form.mrn.trim()) validationErrors.mrn = 'MRN is required';
    if (!form.gender.trim()) validationErrors.gender = 'Gender is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix form validation errors');
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        const updatePayload = {
          mrn: form.mrn,
          gender: form.gender,
          bloodGroup: form.bloodGroup,
          address: form.address,
        };
        await client.put(`/patients/${editingId}`, updatePayload);
        toast.success('Patient updated successfully');
      } else {
        await client.post('/patients', form);
        toast.success('Patient created successfully');
      }

      resetForm();
      await loadPatients();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save patient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingId(patient._id);
    setForm({
      name: patient.user?.name || '',
      email: patient.user?.email || '',
      password: '',
      mrn: patient.mrn || '',
      gender: patient.gender || '',
      bloodGroup: patient.bloodGroup || '',
      address: patient.address || '',
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return;

    try {
      await client.delete(`/patients/${id}`);
      toast.success('Patient deleted');
      await loadPatients();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete patient');
    }
  };

  const filteredPatients = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return patients;

    return patients.filter((patient) => {
      const name = patient.user?.name?.toLowerCase() || '';
      const email = patient.user?.email?.toLowerCase() || '';
      const mrn = patient.mrn?.toLowerCase() || '';
      return name.includes(text) || email.includes(text) || mrn.includes(text);
    });
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPatients.slice(start, start + PAGE_SIZE);
  }, [filteredPatients, page]);

  const startItem = filteredPatients.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endItem = filteredPatients.length ? Math.min(page * PAGE_SIZE, filteredPatients.length) : 0;

  return (
    <div className="space-y-6">
      <Card
        title={editingId ? 'Edit Patient' : 'Add New Patient'}
        subtitle="Create and manage patient records with validated details"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Enter full name"
            />
            {errors.name ? <p className="mt-1 text-xs text-rose-300">{errors.name}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Enter email"
              disabled={Boolean(editingId)}
            />
            {errors.email ? <p className="mt-1 text-xs text-rose-300">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder={editingId ? 'Not editable in update mode' : 'Minimum 6 characters'}
              disabled={Boolean(editingId)}
            />
            {errors.password ? <p className="mt-1 text-xs text-rose-300">{errors.password}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">MRN</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.mrn}
              onChange={(event) => setForm({ ...form, mrn: event.target.value })}
              placeholder="Medical record number"
            />
            {errors.mrn ? <p className="mt-1 text-xs text-rose-300">{errors.mrn}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Gender</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.gender}
              onChange={(event) => setForm({ ...form, gender: event.target.value })}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender ? <p className="mt-1 text-xs text-rose-300">{errors.gender}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Blood Group</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.bloodGroup}
              onChange={(event) => setForm({ ...form, bloodGroup: event.target.value })}
              placeholder="e.g. O+"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <label className="mb-1 block text-sm text-slate-300">Address</label>
            <textarea
              className="h-24 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              placeholder="Patient address"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-3 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Patient' : 'Add Patient'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card
        title="Patient Records"
        subtitle="Search, edit, and manage patient profiles"
        action={
          <div className="relative w-full md:w-80">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, or MRN"
              className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-2 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-cyan-400"
            />
          </div>
        }
      >
        {loading ? (
          <LoadingSpinner label="Loading patient records..." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/70 text-left text-slate-400">
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">MRN</th>
                    <th className="px-3 py-3 font-medium">Gender</th>
                    <th className="px-3 py-3 font-medium">Blood</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.length ? (
                    paginatedPatients.map((patient) => (
                      <tr key={patient._id} className="border-t border-white/10 text-slate-200 hover:bg-white/5">
                        <td className="px-3 py-3">{patient.user?.name || 'N/A'}</td>
                        <td className="px-3 py-3">{patient.user?.email || 'N/A'}</td>
                        <td className="px-3 py-3">{patient.mrn || 'N/A'}</td>
                        <td className="px-3 py-3">{patient.gender || 'N/A'}</td>
                        <td className="px-3 py-3">{patient.bloodGroup || 'N/A'}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1.5 text-xs text-cyan-200 hover:bg-cyan-400/20"
                              onClick={() => handleEdit(patient)}
                            >
                              <FaEdit size={12} /> Edit
                            </button>
                            <button
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-400/10 px-2.5 py-1.5 text-xs text-rose-200 hover:bg-rose-400/20"
                              onClick={() => handleDelete(patient._id)}
                            >
                              <FaTrash size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-8 text-center text-slate-400" colSpan={6}>
                        No patients found for this search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Showing {startItem} to {endItem} of {filteredPatients.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;
